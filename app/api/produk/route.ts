import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const produk = await db.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[GET PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const produk = await db.product.create({
            data: {
                ...values,
                price: parseInt(values.price),
                stock: parseInt(values.stock),
                categoryId: parseInt(values.categoryId)
            }
        })

        return NextResponse.json(produk)
    } catch (error: any) {
        console.log('[ADD PRODUK]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}
