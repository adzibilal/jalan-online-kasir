import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const transaksi = await db.transaction.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[GET PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}