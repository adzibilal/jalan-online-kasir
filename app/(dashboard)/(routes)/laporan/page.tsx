import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Receipt, Printer } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const LaporanPage = () => {
    return (
        <div className='p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-xl'>Menu Laporan</h1>
                <Input className='max-w-sm' placeholder='Cari Menu Laporan' />
            </div>

            <div className='grid grid-cols-5'>
                <Card className='p-5 flex items-center gap-3 justify-between'>
                    <div className='flex items-center gap-3'>
                        <Receipt />
                        <div className=''> Laporan Penjualan</div>
                    </div>
                    <Link href='/laporan/penjualan'>
                        <Button variant='default' size='icon'>
                            <Printer />
                        </Button>
                    </Link>
                </Card>
            </div>
        </div>
    )
}

export default LaporanPage
