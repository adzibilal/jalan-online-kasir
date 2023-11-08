import { db } from "@/lib/db"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

const KategoriPage = async () => {
    const kategori = await db.category.findMany()
    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Kategori Produk</h1>
            <DataTable columns={columns} data={kategori} />
        </div>
    )
}

export default KategoriPage
