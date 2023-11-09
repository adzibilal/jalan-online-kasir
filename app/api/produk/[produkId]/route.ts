import { db } from '@/lib/db'
import md5 from 'md5'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    { params }: { params: { produkId: number } }
) {
    try {
        const values = await req.json()

        const produk = await db.product.update({
            where: {
                id: Number(params.produkId)
            },
            data: {
                ...values,
                price: parseInt(values.price),
                stock: parseInt(values.stock),
                categoryId: parseInt(values.categoryId)
            }
        })

        return NextResponse.json(produk)
    } catch (error: any) {
        console.log('[EDIT PRODUK]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { produkId: number } }
) {
    try {
        const produk = await db.product.delete({
            where: {
                id: Number(params.produkId)
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[DELETE PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
