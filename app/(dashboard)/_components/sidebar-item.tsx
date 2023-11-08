'use-client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarItemProps {
    icon: LucideIcon
    label: string
    href: string
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    const pathname = usePathname()
    const router = useRouter()

    const isActive =
        (pathname === '/' && href === '/') ||
        pathname === href ||
        pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }
    return (
        <button
            className={cn(
                'flex items-center gap-x-2 text-zinc-500 text-sm font-[500] pl-6 transition-all hover:text-white max-md:hover:text-zinc-600 hover:bg-zinc-300/20 max-md:hover:bg-zinc-300/50 mb-2 rounded-md',
                isActive &&
                    'text-white bg-zinc-200/20 hover:bg-zinc-200-200/20 hover:text-white max-md:bg-zinc-900 max-md:hover:bg-zinc-900 max-md:hover:text-white'
            )}
            onClick={onClick}
            type='button'>
            <div className='flex items-center gap-x-2 py-3'>
                <Icon
                    size={22}
                    className={cn('text-zinc-500', isActive && 'text-white')}
                />
                {label}
            </div>
        </button>
    )
}
