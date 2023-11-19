import { db } from '@/lib/db'
import { dateFormat } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const startDate = new Date(values.start)
        const endDate = new Date(values.end)
        

        startDate.setHours(3, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        const totalTransaksi = await db.transaction.findMany({
            where: {
                createdAt: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString()
                }
            },
            include: {
                user: true,
                TransactionDetail: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        

        return NextResponse.json(totalTransaksi)
    } catch (error) {
        console.log('[GET PRODUK]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}
