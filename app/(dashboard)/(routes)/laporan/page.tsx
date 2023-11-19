'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Receipt, Printer } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DatePickerWithRange } from './_components/date-range-picker'
import { Product, User } from '@prisma/client'
import toast from 'react-hot-toast'
import axios from 'axios'
import { dateFormat, rupiahFormat, simpleDateFormat } from '@/lib/utils'
import generatePDF, { Resolution, Margin, Options, usePDF } from 'react-to-pdf'

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

const LaporanPage = () => {
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [laporan, setLaporan] = useState<TransaksiProps[]>()

    const handleChangeDate = (startDate: Date, endDate: Date) => {
        setStartDate(startDate)
        setEndDate(endDate)
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

    const fetchLaporan = async (start: Date, end: Date) => {
        setIsLoading(true)
        toast.loading('Memuat Laporan')
        const values = {
            start: start.toISOString(),
            end: end.toISOString()
        }
        try {
            const res = await axios.post('/api/laporan', values)
            setLaporan(res.data)
            toast.dismiss()
            setIsLoading(false)
        } catch (error) {
            toast.dismiss()
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (startDate && endDate) {
            fetchLaporan(startDate, endDate)
        }
    }, [startDate, endDate])

    const openPDF = () => {
        toast.loading('Membuat Laporan')
        const formmatedStart = startDate ? simpleDateFormat(startDate) : '-'
        const formmatedEnd = endDate ? simpleDateFormat(endDate) : '-'
        const options: Options = {
            filename: `Laporan Transaksi ${formmatedStart} - ${formmatedEnd}.pdf`,
            method: 'save',
            resolution: Resolution.HIGH,
            page: {
                margin: Margin.MEDIUM,
                format: 'a4',
            },
            overrides: {
                pdf: {
                    compress: true
                }
            }
        }

        generatePDF(() => document.getElementById('laporan'), options)
        toast.dismiss()
    }

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-xl'>Laporan Transaksi</h1>
                <div className='flex items-center gap-3'>
                    {startDate && endDate && (
                        <DatePickerWithRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleChangeDate}
                        />
                    )}

                    <Button onClick={openPDF}>
                        <Printer size={18} className='mr-2' />
                        Cetak Laporan
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-1' id='laporan'>
                {startDate && endDate && (
                    <div className='font-bold text-center text-xl'>
                        Laporan Transaksi {startDate.toLocaleDateString()} -{' '}
                        {endDate.toLocaleDateString()}
                    </div>
                )}
                <table className='col-span-5 md:col-span-3 mt-4 border'>
                    <thead>
                        <tr>
                            <th className='text-left border p-1'>
                                ID Transaksi
                            </th>
                            <th className='text-left border p-1'>Tanggal</th>
                            <th className='text-left border p-1'>Kasir</th>
                            <th className='text-left border p-1'>Detail</th>
                            <th className='text-left border p-1'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {laporan && laporan.length > 0 ? (
                            laporan.map((item, index) => (
                                <tr key={index}>
                                    <td className='border p-1'>TRX{item.id}</td>
                                    <td className='border p-1'>
                                        {dateFormat(item.createdAt)}
                                    </td>
                                    <td className='border p-1'>
                                        {item.user.name}
                                    </td>
                                    <td className='border p-1 text-xs'>
                                        {item.TransactionDetail.length > 2 ? (
                                            <div>
                                                {
                                                    item.TransactionDetail[0]
                                                        .product.name
                                                }{' '}
                                                x{' '}
                                                {item.TransactionDetail[0].qty},{' '}
                                                and{' '}
                                                {item.TransactionDetail.length -
                                                    1}{' '}
                                                more...
                                            </div>
                                        ) : (
                                            <div>
                                                {
                                                    item.TransactionDetail[0]
                                                        .product.name
                                                }{' '}
                                                x{' '}
                                                {item.TransactionDetail[0].qty}
                                            </div>
                                        )}
                                    </td>
                                    <td className='border p-1'>
                                        {rupiahFormat(item.total)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    className='text-center border p-1'
                                    colSpan={5}>
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LaporanPage
