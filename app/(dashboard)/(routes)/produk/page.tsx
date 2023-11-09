'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const ProdukPage = () => {
    const [produk, setProduk] = useState([])

    const getProduk = async () => {
        const res = await axios.get('/api/produk')
        setProduk(res.data)
    }

    useEffect(() => {
        getProduk()
    }, [])

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Produk</h1>
            <DataTable
                columns={columns}
                data={produk}
                onReload={() => getProduk()}
            />
        </div>
    )
}

export default ProdukPage
