'use client'
import { Button } from '@/components/ui/button'
import { dateFormat, rupiahFormat } from '@/lib/utils'
import { Product, TransactionDetail, User } from '@prisma/client'
import React from 'react'
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf'

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

interface PrintProps {
    dataTransaksi: TransaksiProps
    tunai: number
    kembali: number
    onClose: () => void
}

const Print = ({ dataTransaksi, onClose, tunai, kembali }: PrintProps) => {
    const openPDF = () => {
        generatePDF(() => document.getElementById('struk'), options)
    }

    const options: Options = {
        filename: `TRX${dataTransaksi.id}.pdf`,
        method: 'open',
        resolution: Resolution.HIGH,
        page: {
            margin: Margin.NONE,
            format: 'a5'
        },
        overrides: {
            pdf: {
                compress: true
            }
        }
    }

    return (
        <>
            <div
                className='bg-zinc-900/50 w-screen h-screen absolute z-0 top-0 left-0'
                onClick={onClose}></div>
            <div className='bg-white absolute z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-dashed mb-2 p-3 rounded-md'>
                <div className='p-3 bg-white' id='struk'>
                    <div className='text-center text-xs w-[300px]'>
                        APLIKASI KASIR
                    </div>
                    <div className='text-center text-sm font-semibold mb-2'>
                        JALAN ONLINE
                    </div>
                    <div className='text-center text-xs mb-2'>
                        {dateFormat(dataTransaksi.createdAt)}
                    </div>

                    {dataTransaksi && (
                        <div
                            className='mt-5 border-t border-dashed '
                            key={dataTransaksi.id}>
                            <div className='flex gap-3 items-center justify-between'>
                                <div className='text-sm'>ID TRANSAKSI</div>
                                <div className='text-sm py-1 font-semibold rounded-sm'>
                                    TRX{dataTransaksi.id}
                                </div>
                            </div>
                            <div className='flex gap-3 items-center justify-between my-1'>
                                <div className='text-sm'>Total</div>
                                <div className='text-sm font-semibold rounded-sm'>
                                    {rupiahFormat(dataTransaksi.total)}
                                </div>
                            </div>
                            <div className='flex gap-3 items-center justify-between my-1'>
                                <div className='text-sm'>Kasir</div>
                                <div className='text-sm font-semibold rounded-sm'>
                                    {dataTransaksi.user.name}
                                </div>
                            </div>
                            {dataTransaksi.TransactionDetail.map(
                                (detail, index) => (
                                    <div
                                        className='grid grid-cols-2 gap-3 items-center mb-2 border-t border-dashed '
                                        key={index}>
                                        <div className=''>
                                            <div className='text-sm'>
                                                {detail.product.name}
                                            </div>
                                            <div className='text-xs'>
                                                {rupiahFormat(
                                                    detail.product.price
                                                )}{' '}
                                                x {detail.qty}
                                            </div>
                                            {detail.discount > 0 && (
                                                <div className='text-xs'>
                                                    Diskon : -{detail.discount}
                                                </div>
                                            )}
                                        </div>
                                        <div className='text-sm font-semibold rounded-sm text-right'>
                                            {rupiahFormat(detail.subTotal)}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                    <div className='border-t border-dashed pt-3'>
                        <div className='grid grid-cols-2 gap-3 items-center'>
                            <div className='text-xs text-right'>TOTAL =</div>
                            <div className='text-sm text-right font-semibold'>
                                {rupiahFormat(dataTransaksi.total)}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-3 items-center'>
                            <div className='text-xs text-right'>TUNAI =</div>
                            <div className='text-sm text-right font-semibold'>
                                {rupiahFormat(tunai)}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-3 items-center'>
                            <div className='text-xs text-right'>KEMBALI =</div>
                            <div className='text-sm text-right font-semibold'>
                                {rupiahFormat(kembali)}
                            </div>
                        </div>
                    </div>
                </div>
                <Button className='mt-5 w-full' onClick={openPDF}>
                    PRINT
                </Button>
                <Button
                    className='mt-5 w-full'
                    variant='secondary'
                    onClick={onClose}>
                    TUTUP
                </Button>
            </div>
        </>
    )
}

export default Print
