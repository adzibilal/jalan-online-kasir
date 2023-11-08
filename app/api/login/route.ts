import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        console.log('hashedPassword', password)

        const user = await db.user.findUnique({
            where: {
                username,
                password: password
            },
            select: {
                id: true,
                username: true,
                role: true,
                name: true
            }
        })

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.log('[LOGIN]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
