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

        const totalPendapatan = totalTransaksi.reduce(
            (total: number, item: any) => {
                return total + item.total
            },
            0
        )

        const totalProduk = await db.product.findMany({})
        const totalKategori = await db.category.findMany({})
        const totalUser = await db.user.findMany({
            where: {
                role: 'staff'
            }
        })
        const totalAdmin = await db.user.findMany({
            where: {
                role: 'admin'
            }
        })

        const dashboard = {
            totalTransaksi: totalTransaksi,
            totalPendapatan: totalPendapatan,
            totalProduk: totalProduk,
            totalKategori: totalKategori,
            totalUser: totalUser,
            totalAdmin: totalAdmin
        }

        return NextResponse.json(dashboard)
    } catch (error) {
        console.log('[GET PRODUK]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}
