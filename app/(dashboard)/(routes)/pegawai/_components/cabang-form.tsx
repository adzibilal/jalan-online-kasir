'use client'
import * as z from 'zod'
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
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface CabangFormProps {
    initialData: {
        nama: string
        alamat: string
        email?: string
        nomorTelepon: string
    }
    cabangId?: string
}

const formSchema = z.object({
    nama: z.string().min(1),
    alamat: z.string().min(1),
    email: z.string().min(1),
    nomorTelepon: z.string().min(1)
})

export const CabangForm = ({ initialData, cabangId }: CabangFormProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            await axios.patch(`/api/cabang/${cabangId}`, values)
            toast.success('Cabang updated')
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='mt-6 border bg-zinc-50 rounded-md p-4'>
            <div className='flex font-medium items-center justify-between'>
                Detail Cabang
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className='h-4 mr-2 w-4' />
                            Edit Cabang
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <>
                <p className='mt-2 font-bold text-2xl'>{initialData.nama}</p>
                <p className='mt-2 text-zinc-600 text-sm'>{initialData.alamat}</p>
                <p className='mt-2 text-sm'>{initialData.nomorTelepon}</p>
                <p className='mt-2  text-sm'>{initialData.email}</p>
                </>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='nama'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Nama cabang ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='alamat'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Alamat cabang ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='nomorTelepon'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Nomor cabang ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Email cabang ..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
