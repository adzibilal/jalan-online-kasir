import { db } from "@/lib/db"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

const PegawaiPage = async () => {
    const pegawai = await db.user.findMany()
    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Pegawai</h1>
            <DataTable columns={columns} data={pegawai} />
        </div>
    )
}

export default PegawaiPage
