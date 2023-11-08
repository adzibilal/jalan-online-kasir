'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { el } from 'date-fns/locale'

interface AddPegawaiProps {
    onClose: () => void
}

const AddPegawai = ({ onClose }: AddPegawaiProps) => {
    const router = useRouter()

    const formSchema = z.object({
        email: z.string().email({
            message: 'Email tidak valid'
        }),
        username: z
            .string()
            .min(1, {
                message: 'Username wajib di isi'
            })
            .max(50, {
                message: 'Username maksimal 50 karakter'
            }),
        password: z
            .string()
            .min(1, {
                message: 'Password wajib di isi'
            })
            .max(50, {
                message: 'Password maksimal 50 karakter'
            }),
        name: z
            .string()
            .min(1, {
                message: 'Nama Pegawai wajib di isi'
            })
            .max(50, {
                message: 'Nama Pegawai maksimal 50 karakter'
            }),
        phone: z
            .string()
            .min(1, {
                message: 'Nomor Telepon wajib di isi'
            })
            .max(20, {
                message: 'Nomor Telepon maksimal 20 karakter'
            }),
        role: z
            .string()
            .min(1, {
                message: 'Role wajib di isi'
            })
            .max(20, {
                message: 'Role maksimal 20 karakter'
            })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.post(`/api/pegawai/`, values)
            toast.dismiss()
            toast.success('Pegawai ditambahkan')
            onClose()
            router.refresh()
        } catch (error: any) {
            toast.dismiss()
            if (error.response.data.includes('User_email_key')) {
                toast.error('Email sudah digunakan')
            } else if (error.response.data.includes('User_username_key')) {
                toast.error('Username sudah digunakan')
            } else {
                toast.error('Gagal menambahkan pegawai')
            }
        }
    }

    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='font-bold text-xl mb-5'>Tambah Pegawai</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Email ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Username ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Password ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Pegawai</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama Pegawai ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor Telepon</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nomor Telepon ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                {
                                                    value: 'admin',
                                                    label: 'Admin'
                                                },
                                                {
                                                    value: 'staff',
                                                    label: 'Staff'
                                                }
                                            ]}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={isSubmitting} type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default AddPegawai
