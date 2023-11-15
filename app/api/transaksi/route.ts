import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const transaksi = await db.transaction.findMany({
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
            },
            take: 10
        })

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[GET TRANSAKSI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const transaction = await db.transaction.create({
            data: {
                userId: parseInt(values.userId),
                total: parseInt(values.total),
                TransactionDetail: {
                    create: values.produk.map((item: any) => ({
                        productId: parseInt(item.idProduk),
                        qty: parseInt(item.qty),
                        price: parseInt(item.price),
                        subTotal: parseInt(item.subtotal),
                        discount: parseInt(item.discount) || 0
                    }))
                }
            }
        })

        if (transaction) {
            for (const item of values.produk) {
                await db.product.update({
                    where: {
                        id: parseInt(item.idProduk)
                    },
                    data: {
                        stock: {
                            decrement: parseInt(item.qty)
                        }
                    }
                })
            }
        }

        const addedTransaction = await db.transaction.findUnique({
            where: {
                id: transaction.id
            },
            include: {
                user: true,
                TransactionDetail: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json(addedTransaction)
    } catch (error: any) {
        console.log('[ADD TRANSAKSI]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}
