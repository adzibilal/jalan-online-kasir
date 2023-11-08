import { db } from '@/lib/db'
import md5 from 'md5'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    { params }: { params: { pegawaiId: number } }
) {
    try {
        const values = await req.json()

        const pegawai = await db.user.update({
            where: {
                id: Number(params.pegawaiId)
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(pegawai)
    } catch (error: any) {
        console.log('[EDIT USER]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { pegawaiId: number } }
) {
    try {
        const pegawai = await db.user.delete({
            where: {
                id: Number(params.pegawaiId)
            }
        })

        return NextResponse.json(pegawai)
    } catch (error) {
        console.log('[DELETE USER]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
