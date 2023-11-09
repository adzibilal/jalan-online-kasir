'use client'
import { Button } from '@/components/ui/button'
import React, { use, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MobileSidebar } from './mobile-sidebar'
import useSessionStore from '@/store/sessions'

const Navbar = () => {
    const user = useSessionStore((state) => state.user)
    return (
        <nav className='h-full text-white p-3 flex items-center justify-between px-6'>
            <div className='flex items-center gap-3'>
                <MobileSidebar />
                <div className='max-sm:hidden'>Hello {user?.name}</div>
            </div>
            <div className='flex items-center gap-2'>
                <Button
                    variant='secondary'
                    onClick={() => {
                        localStorage.removeItem('session')
                        toast.success('Logout Berhasil')
                        window.location.href = '/sign-in'
                    }}>
                    Logout
                </Button>
            </div>
        </nav>
    )
}

export default Navbar
