'use client'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DatePickerWithRange } from '../_components/date-range-picker'
import { dateFormat, rupiahFormat, simpleDateFormat } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { DateRange } from 'react-day-picker'
import { Product, User } from '@prisma/client'

interface DashboardProps {
    totalTransaksi: []
    totalPendapatan: number
    totalProduk: []
    totalKategori: []
    totalUser: []
    totalAdmin: []
}

interface TransaksiProps {
    id: number
    userId: number
    total: number
    user: User
    createdAt: Date
    TransactionDetail: [
        {
            id: number
            qty: number
            price: number
            subTotal: number
            discount: number
            product: Product
        }
    ]
}

export default function Home() {
    const [dashboard, setDashboard] = useState<DashboardProps>()
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [dataTrx, setDataTrx] = useState<TransaksiProps[]>()

    const fetchDashboard = async (start: Date, end: Date) => {
        setIsLoading(true)
        toast.loading('Memuat Dashboard')
        const values = {
            start: start.toISOString(),
            end: end.toISOString()
        }
        try {
            const res = await axios.post('/api/dashboard', values)
            setDashboard(res.data)
            const ten = res.data.totalTransaksi.slice(0, 10)
            setDataTrx(ten)
            toast.dismiss()
            setIsLoading(false)
        } catch (error) {
            toast.dismiss()
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const startDate = new Date()
        const endDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        console.error(startDate, endDate)
        setStartDate(startDate)
        setEndDate(endDate)
    }, [])

    useEffect(() => {
        if (startDate && endDate) {
            fetchDashboard(startDate, endDate)
        }
    }, [startDate, endDate])

    const handleChangeDate = (startDate: Date, endDate: Date) => {
        setStartDate(startDate)
        setEndDate(endDate)
    }
    return (
        <main className='p-6'>
            {!isLoading ? (
                <>
                    <div className='flex items-center justify-between mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-3'>
                        <h1 className='text-2xl font-bold'>
                            Dashboard Aplikasi Kasir
                        </h1>
                        {startDate && endDate && (
                            <DatePickerWithRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={handleChangeDate}
                            />
                        )}
                    </div>

                    {dashboard && (
                        <>
                            <div className='grid grid-cols-2 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1 mb-4'>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className=''>
                                            <div className='text-sm font-bold'>
                                                Total Transaksi
                                            </div>
                                            <div className='text-sm'>
                                                {simpleDateFormat(startDate!)} -{' '}
                                                {simpleDateFormat(endDate!)}
                                            </div>
                                        </div>
                                        <div className='bg-blue-300 text-blue-700 text-xl px-3 py-1 font-bold rounded-sm'>
                                            {dashboard.totalTransaksi.length}
                                        </div>
                                    </div>
                                </Card>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className=''>
                                            <div className='text-sm font-bold'>
                                                Total Pendapatan
                                            </div>
                                            <div className='text-sm max-sm:text-xs'>
                                                {simpleDateFormat(startDate!)} -{' '}
                                                {simpleDateFormat(endDate!)}
                                            </div>
                                        </div>
                                        <div className='text-2xl font-bold rounded-sm text-green-600 max-sm:text-lg'>
                                            {rupiahFormat(
                                                dashboard.totalPendapatan
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className='grid grid-cols-4 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1'>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className='text-sm'>
                                            Total Produk
                                        </div>
                                        <div className='bg-blue-300 text-blue-700 text-xl px-3 py-1 font-bold rounded-sm'>
                                            {dashboard.totalProduk.length}
                                        </div>
                                    </div>
                                </Card>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className='text-sm'>
                                            Total Kategori
                                        </div>
                                        <div className='bg-blue-300 text-blue-700 text-xl px-3 py-1 font-bold rounded-sm'>
                                            {dashboard.totalKategori.length}
                                        </div>
                                    </div>
                                </Card>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className='text-sm'>
                                            Total Staff
                                        </div>
                                        <div className='bg-blue-300 text-blue-700 text-xl px-3 py-1 font-bold rounded-sm'>
                                            {dashboard.totalUser.length}
                                        </div>
                                    </div>
                                </Card>
                                <Card className='p-3 border-dashed mb-2 h-max'>
                                    <div className='flex gap-3 items-center justify-between'>
                                        <div className='text-sm'>
                                            Total Admin
                                        </div>
                                        <div className='bg-blue-300 text-blue-700 text-xl px-3 py-1 font-bold rounded-sm'>
                                            {dashboard.totalAdmin.length}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className='mt-2'>
                                <div className='text-xl font-bold mb-5'>
                                    Riwayat Transaksi{' '}
                                    {simpleDateFormat(startDate!)} -{' '}
                                    {simpleDateFormat(endDate!)}
                                </div>

                                <div className='border border-dashed p-2 grid grid-cols-5 gap-3 items-center'>
                                    <div className='font-semibold text-sm'>
                                        ID TRANSAKSI
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        TANGGAL TRANSAKSI
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        KASIR
                                    </div>

                                    <div className='font-semibold text-sm'>
                                        DETAIL
                                    </div>

                                    <div className='font-semibold text-sm'>
                                        TOTAL
                                    </div>
                                </div>

                                {dataTrx &&
                                    dataTrx.map((transaksi: TransaksiProps) => (
                                        <div
                                            className='border border-dashed p-2 grid grid-cols-5 gap-3 items-center'
                                            key={transaksi.id}>
                                            <div className='font-semibold'>
                                                TRX{transaksi.id}
                                            </div>
                                            <div className='text-sm'>
                                                {dateFormat(
                                                    transaksi.createdAt
                                                )}
                                            </div>
                                            <div className='font-semibold'>
                                                {transaksi.user.name}
                                            </div>

                                            <div className='text-xs flex gap-3'>
                                                <div className=''>
                                                    {transaksi.TransactionDetail[0].product.name} x{' '}
                                                    {transaksi.TransactionDetail[0].qty}
                                                </div>
                                                
                                                {transaksi.TransactionDetail.length > 1 && (
                                                    <div className='text-zinc-400'>
                                                        {transaksi.TransactionDetail.length - 1} more...
                                                    </div>
                                                )}

                                            </div>

                                            <div className='font-semibold'>
                                                {rupiahFormat(transaksi.total)}
                                            </div>
                                        </div>
                                    ))}

                                {dashboard.totalTransaksi.length > 10 && (
                                    <div className='text-center mt-5 text-sm'>
                                        And{' '}
                                        {dashboard.totalTransaksi.length - 10}{' '}
                                        more...
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className='w-full h-[50vh] flex items-center justify-center'>
                    <div className='animate-bounce'>Loading...</div>
                </div>
            )}
        </main>
    )
}
