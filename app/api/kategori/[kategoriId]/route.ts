import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    { params }: { params: { kategoriId: number } }
) {
    try {
        const { kategoriId } = params

        const values = await req.json()

        const kategori = await db.category.update({
            where: {
                id: Number(kategoriId)
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[UPDATE KATEGORI]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { kategoriId: number } }
) {
    try {
        const { kategoriId } = params

        const kategori = await db.category.delete({
            where: {
                id: Number(kategoriId)
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[DELETE KATEGORI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
