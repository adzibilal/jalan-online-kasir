'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { cn } from '@/lib/utils'

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Nama Pegawai
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Email
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'username',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Username
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    No Telepon
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Role
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const { role } = row.original
            return (
                <div
                    className={cn({
                        'flex items-center gap-3 w-max uppercase font-semibold text-xs px-3 py-1 rounded-full':
                            true,
                        'bg-green-100 text-green-800': role === 'admin',
                        'bg-zinc-100 text-zinc-800': role === 'staff'
                    })}>
                    {role}
                </div>
            )
        }
    },
    {
        id: 'actions',
        cell: ({ table, row }) => {
            const { id } = row.original

            return (
                <div className='flex items-center gap-3'>
                    <Button
                        variant='destructive'
                        size='sm'
                        className='w-max'
                        //@ts-ignore
                        onClick={() => table?.options?.meta?.handleDelete(id)}>
                        <Trash className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='default'
                        size='sm'
                        className='w-max'
                        onClick={() =>
                            //@ts-ignore
                            table?.options?.meta?.handleEdit(row.original)
                        }>
                        <Pencil className='h-4 w-4' />
                    </Button>
                </div>
            )
        }
    }
]
