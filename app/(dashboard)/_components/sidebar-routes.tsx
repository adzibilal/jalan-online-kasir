'use client'

import {
    Layout,
    Compass,
    List,
    BarChart,
    Users,
    Coffee,
    Book,
    Calculator,
    ShoppingBasket,
    Store,
    Box,
    Boxes,
    FileBoxIcon,
    ListChecks
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { usePathname, useRouter } from 'next/navigation'

const adminRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/'
    },
    {
        icon: Calculator,
        label: 'Kasir',
        href: '/kasir'
    },
    {
        icon: Coffee,
        label: 'Produk',
        href: '/produk'
    },
    {
        icon: Box,
        label: 'Kategori',
        href: '/kategori'
    },
    {
        icon: ListChecks,
        label: 'Laporan',
        href: '/laporan'
    },
    {
        icon: Users,
        label: 'Pegawai',
        href: '/pegawai'
    }
]

const staffRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/'
    },
    {
        icon: Calculator,
        label: 'Kasir',
        href: '/kasir'
    },
    {
        icon: Coffee,
        label: 'Produk',
        href: '/produk'
    },
    {
        icon: Box,
        label: 'Kategori',
        href: '/kategori'
    },
    {
        icon: ShoppingBasket,
        label: 'Bahan Baku',
        href: '/bahan-baku'
    },
    {
        icon: FileBoxIcon,
        label: 'Inventory',
        href: '/inventory'
    }
]

export const SidebarRoutes = () => {
    const pathname = usePathname()

    const isAdmin = true

    const routes = isAdmin ? adminRoutes : staffRoutes
    return (
        <div className='flex flex-col w-full'>
            {routes.map(route => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}
