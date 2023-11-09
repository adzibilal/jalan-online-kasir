'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { Product } from '@prisma/client'

interface EditProdukProps {
    initialData: Product
    onClose: () => void,
    onReload: () => void
}

interface dataKategori {
    label: string
    value: string
}

const EditProduk = ({ onClose, initialData , onReload}: EditProdukProps) => {
    const [dataKategori, setDataKategori] = useState<dataKategori[]>([])

    const router = useRouter()

    const formSchema = z.object({
        name: z
            .string()
            .min(1, {
                message: 'Nama Produk wajib di isi'
            })
            .max(255, {
                message: 'Nama Produk maksimal 255 karakter'
            }),
        description: z.string().max(255, {
            message: 'Deskripsi maksimal 255 karakter'
        }),
        price: z
            .string()
            .min(1, {
                message: 'Harga wajib di isi'
            })
            .max(999999999999, {
                message: 'Harga maksimal 12 digit'
            }),
        stock: z
            .string()
            .min(1, {
                message: 'Stok wajib di isi'
            })
            .max(999999999999, {
                message: 'Stok maksimal 12 digit'
            }),
        unit: z
            .string()
            .min(1, {
                message: 'Satuan wajib di isi'
            })
            .max(255, {
                message: 'Satuan maksimal 255 karakter'
            }),
        categoryId: z.string().min(1, {
            message: 'Kategori wajib di isi'
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
            description: initialData.description || '',
            price: initialData.price.toString(),
            stock: initialData.stock.toString(),
            unit: initialData.unit || '',
            categoryId: initialData.categoryId.toString()
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.patch(`/api/produk/${initialData.id}`, values)
            toast.dismiss()
            toast.success('Produk diedit')
            onClose()
            router.refresh()
            onReload()
        } catch (error: any) {
            toast.dismiss()
            if (error.response.data.includes('User_email_key')) {
                toast.error('Email sudah digunakan')
            } else if (error.response.data.includes('User_username_key')) {
                toast.error('Username sudah digunakan')
            } else {
                toast.error('Gagal mengedit produk')
            }
        }
    }
    useEffect(() => {
        const getKategori = async () => {
            try {
                const kategori = await axios.get(`/api/kategori`)
                setDataKategori(
                    kategori.data.map((item: { name: string; id: string }) => ({
                        label: item.name,
                        value: item.id.toString()
                    }))
                )
            } catch (error) {
                toast.error('Something went wrong')
            }
        }
        getKategori()
    }, [])
    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='flex justify-between items-center mb-5'>
                    <div className='font-bold text-xl '>Edit Produk</div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama  ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Deskripsi ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Harga ...'
                                            type='number'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='stock'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Stock ...'
                                            {...field}
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='unit'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Satuan</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                {
                                                    value: 'gr',
                                                    label: 'Gram'
                                                },
                                                {
                                                    value: 'ml',
                                                    label: 'Mililiter'
                                                },
                                                {
                                                    value: 'pcs',
                                                    label: 'Pcs'
                                                },
                                                {
                                                    value: 'kg',
                                                    label: 'Kilogram'
                                                },
                                                {
                                                    value: 'botol',
                                                    label: 'Botol'
                                                },
                                                {
                                                    value: 'bungkus',
                                                    label: 'Bungkus'
                                                },
                                                {
                                                    value: 'kotak',
                                                    label: 'Kotak'
                                                },
                                                {
                                                    value: 'pack',
                                                    label: 'Pack'
                                                },
                                                {
                                                    value: 'buah',
                                                    label: 'Buah'
                                                }
                                            ]}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Combobox
                                        options={...dataKategori}
                                        {...field}
                                    />
                                    <FormDescription>
                                        Pilih kategori produk
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={isSubmitting} type='submit'>
                                Edit Produk
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default EditProduk
