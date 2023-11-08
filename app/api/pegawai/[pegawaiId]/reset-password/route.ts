import { db } from '@/lib/db'
import md5 from 'md5'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { pegawaiId: number } }) {
    try {
        const defPass = 'jlnonline123'
        const hassedpass = md5(defPass)


        const pegawai = await db.user.update({
            where: {
                id: Number(params.pegawaiId)
            },
            data: {
                password: hassedpass
            }
        })

        return NextResponse.json(pegawai)
    } catch (error: any) {
        console.log('[RESET PASS USER]', error)
        return new NextResponse(`'Internal Error' ${error}`, { status: 500 })
    }
}
