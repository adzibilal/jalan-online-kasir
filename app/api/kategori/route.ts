import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
    req: Request
) {
    try {
        const values = await req.json()

        const kategori = await db.category.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[ADD KATEGORI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET(
    req: Request
) {
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