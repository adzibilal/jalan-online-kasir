'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import toast from 'react-hot-toast'
import { MobileSidebar } from './mobile-sidebar'

const Navbar = () => {


    return (
        <nav className='h-full text-white p-3 flex items-center justify-between px-6'>
            <div className='flex items-center gap-3'>
                <MobileSidebar />
                <div className='max-sm:hidden'>Hello</div>
            </div>
            <div className="flex items-center gap-2">
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
