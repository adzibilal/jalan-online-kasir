import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SidebarRoutes } from './sidebar-routes'

const Sidebar = () => {
    return (
        <div className='p-3 text-white'>
            <p className='text-xs mt-10 text-center max-md:text-zinc-950'>
                APLIKASI KASIR
            </p>
            <h2 className='font-bold text-xl text-center mb-10 max-md:text-zinc-950'>
                JALAN ONLINE
            </h2>
            <SidebarRoutes />
        </div>
    )
}

export default Sidebar
