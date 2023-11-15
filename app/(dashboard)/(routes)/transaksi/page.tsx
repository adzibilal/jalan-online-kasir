'use client'
import { Card, CardHeader } from '@/components/ui/card'
import { rupiahFormat } from '@/lib/utils'
import { Product, Transaction, TransactionDetail, User } from '@prisma/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface TransaksiProps {
    id: number
    userId: number
    total: number
    user: User
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

const Transaksi = () => {
    const [transaksi, setTransaksi] = useState<TransaksiProps[]>()

    const fetchTransaksi = async () => {
        try {
            const res = await axios.get('/api/transaksi')
            setTransaksi(res.data)
        } catch (error) {
            toast.error('Gagal Mengambil Transaksi')
        }
    }

    useEffect(() => {
        fetchTransaksi()
    }, [])
    return (
        <div className='p-6'>
            <div className='text-xl font-bold mb-5'>Riwayat Transaksi</div>

            <div className='grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1'>
                {transaksi &&
                    transaksi.map(trx => (
                        <Card className='p-3 border-dashed mb-2 h-max' key={trx.id}>
                            <div className='flex gap-3 items-center justify-between'>
                                <div className='text-sm'>ID TRANSAKSI</div>
                                <div className='bg-blue-300 text-blue-700 px-3 text-sm py-1 font-bold rounded-sm'>
                                    TRX{trx.id}
                                </div>
                            </div>
                            <div className='flex gap-3 items-center justify-between my-2'>
                                <div className='text-sm'>Total</div>
                                <div className='text-sm font-bold rounded-sm'>
                                    {rupiahFormat(trx.total)}
                                </div>
                            </div>
                            <div className='flex gap-3 items-center justify-between my-2'>
                                <div className='text-sm'>Kasir</div>
                                <div className='text-sm font-bold rounded-sm'>
                                    {trx.user.name}
                                </div>
                            </div>

                            <hr className='mb-2'/>
                            {trx.TransactionDetail.map((detail, index) => (
                                <div
                                    className='grid grid-cols-2 gap-3 items-center mb-2'
                                    key={index}>
                                    <div className=''>
                                        <div className='text-sm'>
                                            {detail.product.name}
                                        </div>
                                        <div className='text-xs'>
                                            {rupiahFormat(detail.product.price)} x {detail.qty}
                                        </div>
                                        {detail.discount > 0 && (
                                            <div className='text-xs text-red-400'>
                                                Diskon : -{detail.discount}
                                            </div>
                                        )}
                                    </div>
                                    <div className='text-sm font-bold rounded-sm text-right'>
                                        {rupiahFormat(detail.subTotal)}
                                    </div>
                                </div>
                            ))}
                        </Card>
                    ))}
            </div>
        </div>
    )
}

export default Transaksi
