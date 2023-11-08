'use client'

import useSessionStore from '@/store/sessions'
import { is } from 'date-fns/locale'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SessionProvider = () => {
    const router = useRouter()

    const session = JSON.parse(localStorage.getItem('session')!)

    const isExpired = (expDateTime: string) => {
        const now = new Date()
        const expDate = new Date(expDateTime)
        return now > expDate
    }

    const pathname = usePathname()
    useEffect(() => {
        if (
            (!session || isExpired(session.expDateTime)) &&
            pathname !== '/sign-in'
        ) {
            router.push('/sign-in')
        }

        if (
            session &&
            !isExpired(session.expDateTime) &&
            pathname === '/sign-in'
        ) {
            router.back()
        }
    }, [session, router, pathname])
    return null
}

export default SessionProvider
