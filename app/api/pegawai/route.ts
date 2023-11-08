import { db } from '@/lib/db'
import md5 from 'md5'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const pegawai = await db.user.create({
            data: {
                ...values,
                password: md5(values.password)
            }
        })

        return NextResponse.json(pegawai)
    } catch (error: any) {
        console.log('[ADD PEGAWAI]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const kategori = await db.category.findMany({
            orderBy: {
                id: 'asc'
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[GET KATEGORI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
