'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { rupiahFormat } from '@/lib/utils'
import useSessionStore from '@/store/sessions'
import { Product, User } from '@prisma/client'
import axios from 'axios'
import { Edit, MinusCircle, PlusCircle, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Print from './_components/print'
interface optProduk {
    label: string
    value: string
}

interface itemTransaksi {
    idProduk: number
    name: string
    price: number
    qty: number
    discount: number
    subtotal: number
}

interface dataTransaksi {
    id: number
    userId: number
    total: number
    produk: itemTransaksi[]
}

interface TransaksiProps {
    id: number
    userId: number
    total: number
    user: User
    createdAt: Date
    TransactionDetail: [
        {
            id: number
            qty: number
            price: number
            subTotal: number
            discount: number
            product: Product
        }
    ]
}

const KasirPage = () => {
    const router = useRouter()
    const [optProduk, setOptProduk] = useState<optProduk[]>([])
    const [dataProduk, setDataProduk] = useState([])
    const [selectedProduk, setSelectedProduk] = useState(undefined)
    const [bayar, setBayar] = useState(0)
    const [kembalian, setKembalian] = useState(0)
    const [dataForm, setDataForm] = useState<itemTransaksi>({
        idProduk: 0,
        name: '',
        price: 0,
        qty: 0,
        discount: 0,
        subtotal: 0
    })
    const [addTrx, setAddTrx] = useState<TransaksiProps>()
    const [isPrint, setIsPrint] = useState(false)
    const [trxId, setTrxId] = useState(0)

    const getUserId = () => {
        if (
            typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined'
        ) {
            return localStorage.getItem('session')
                ? Number(JSON.parse(localStorage.getItem('session')!).user.id)
                : 0
        } else {
            return 0
        }
    }
    
    const [dataTransaksi, setDataTransaksi] = useState<dataTransaksi>({
        id: 0,
        userId: getUserId(),
        total: 0,
        produk: []
    })

    const getProduk = async () => {
        try {
            const res = await axios.get('/api/produk')
            setDataProduk(res.data)
            setOptProduk(
                res.data.map((item: any) => ({
                    label: `${item.id} - ${item.name}`,
                    value: item.id
                }))
            )
        } catch (error) {
            toast.error('Gagal mengambil data produk')
        }
    }
    const getLastTransaksi = async () => {
        try {
            const res = await axios.get('/api/transaksi/getlatest')
            setTrxId(res.data.id + 1)
            console.log(res.data)
        } catch (error) {
            toast.error('Gagal mengambil data transaksi')
        }
    }
    useEffect(() => {
        getProduk()
        getLastTransaksi()
    }, [])

    const handleChangeProduk = (e: any) => {
        console.log(e)
        setSelectedProduk(e)
        const selectedProduk: Product = dataProduk.filter(
            (item: Product) => item.id === e
        )[0]
        setDataForm({
            idProduk: selectedProduk?.id,
            name: selectedProduk.name,
            price: selectedProduk.price,
            qty: 1,
            discount: 0,
            subtotal: selectedProduk.price
        })
    }

    const handleQtyChange = (e: any) => {
        const value = Number(e.target.value)

        if (dataForm.idProduk === 0) {
            return toast.error('Pilih produk terlebih dahulu')
        }
        if (isNaN(value)) {
            return
        }
        if (value < 1) {
            return
        }
        setDataForm({
            ...dataForm,
            qty: value,
            subtotal: dataForm.price * value
        })
    }

    const handleDiscountChange = (e: any) => {
        const value = Number(e.target.value)

        if (dataForm.idProduk === 0) {
            return toast.error('Pilih produk terlebih dahulu')
        }
        if (isNaN(value)) {
            return
        }
        if (value < 0) {
            return toast.error('Discount tidak boleh kurang dari 0')
        }

        setDataForm({
            ...dataForm,
            discount: value,
            subtotal: dataForm.price * dataForm.qty - value
        })
    }

    const handleAddProduk = () => {
        if (dataForm.idProduk === 0) {
            return toast.error('Pilih produk terlebih dahulu')
        }

        const produk = dataTransaksi.produk.filter(
            (item: itemTransaksi) => item.idProduk === dataForm.idProduk
        )[0]

        if (produk) {
            const newProduk = dataTransaksi.produk.map(
                (item: itemTransaksi) => {
                    if (item.idProduk === dataForm.idProduk) {
                        return {
                            ...item,
                            qty: item.qty + dataForm.qty,
                            discount: item.discount + dataForm.discount,
                            subtotal: item.subtotal + dataForm.subtotal
                        }
                    }
                    return item
                }
            )
            setDataTransaksi({
                ...dataTransaksi,
                total: dataTransaksi.total + dataForm.subtotal,
                produk: newProduk
            })
            toast.success('Produk berhasil ditambahkan')
        } else {
            setDataTransaksi({
                ...dataTransaksi,
                total: dataTransaksi.total + dataForm.subtotal,
                produk: [...dataTransaksi.produk, dataForm]
            })
            toast.success('Produk berhasil ditambahkan')
        }

        setSelectedProduk(undefined)
        setDataForm({
            idProduk: 0,
            name: '',
            price: 0,
            qty: 0,
            discount: 0,
            subtotal: 0
        })
    }

    const handleChangeBayar = (e: any) => {
        const value = Number(e.target.value)

        if (isNaN(value)) {
            return
        }
        if (value < 0) {
            return
        }
        if (dataTransaksi.total === 0) {
            return toast.error('Tambahkan produk terlebih dahulu')
        }
        setBayar(value)
        setKembalian(value - dataTransaksi.total)
    }

    const handleDeleteProduk = (idProduk: number) => {
        //delete produk from dataTransaksi
        const confirm = window.confirm('Yakin ingin menghapus produk?')
        if (!confirm) return
        const newProduk = dataTransaksi.produk.filter(
            (item: itemTransaksi) => item.idProduk !== idProduk
        )
        setDataTransaksi({
            ...dataTransaksi,
            produk: newProduk
        })
        toast.success('Produk berhasil dihapus')
    }

    const editQtyChange = (qty: number, id: number) => {
        const value = Number(qty)

        if (isNaN(value)) {
            return
        }
        if (value < 1) {
            const confirm = window.confirm('Yakin ingin menghapus produk?')

            if (!confirm) return
            const newProduk = dataTransaksi.produk.filter(
                (item: itemTransaksi) => item.idProduk !== id
            )
            setDataTransaksi({
                ...dataTransaksi,
                produk: newProduk
            })
            return
        }
        const newProduk = dataTransaksi.produk.map((item: itemTransaksi) => {
            if (item.idProduk === id) {
                return {
                    ...item,
                    qty: value,
                    subtotal: item.price * value - item.discount
                }
            }
            return item
        })
        const newTotal = newProduk.reduce(
            (acc: number, item: itemTransaksi) => acc + item.subtotal,
            0
        )
        setDataTransaksi({
            ...dataTransaksi,
            total: newTotal,
            produk: newProduk
        })
    }

    const handleBayar = async () => {
        toast.loading('Loading...')
        if (bayar < dataTransaksi.total) {
            toast.dismiss()
            return toast.error('Uang bayar kurang')
        }
        if (dataTransaksi.produk.length === 0) {
            toast.dismiss()
            return toast.error('Tambahkan produk terlebih dahulu')
        }
        try {
            const res = await axios.post('/api/transaksi', dataTransaksi)

            console.debug(res.data)
            toast.dismiss()
            setAddTrx(res.data)
            setIsPrint(true)
        } catch (error) {
            toast.dismiss()
            toast.error('Transaksi gagal')
        }
    }

    const onPrintClosed = () => {
        setIsPrint(false)
        setAddTrx(undefined)
        toast.success('Transaksi berhasil')
        setBayar(0)
        setKembalian(0)
        setDataTransaksi({
            ...dataTransaksi,
            id: 0,
            total: 0,
            produk: []
        })
        getLastTransaksi()
        router.refresh()
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-5'>FORM TRANSAKSI</h1>
            {isPrint && (
                <Print
                    dataTransaksi={addTrx!}
                    onClose={onPrintClosed}
                    tunai={bayar}
                    kembali={kembalian}
                />
            )}
            <div className='grid grid-cols-[3fr_minmax(400px,_1fr)] gap-3'>
                <div className='h-10'>
                    <Card className='p-3'>
                        <h1 className='font-semibold mb-2'>Pilih Barang</h1>
                        <Combobox
                            options={...optProduk}
                            value={selectedProduk}
                            onChange={handleChangeProduk}
                        />
                        {dataForm && (
                            <div className='my-5'>
                                <div className='grid grid-cols-2 gap-5 max-md:grid-cols-1'>
                                    <div className=''>
                                        <div className='text-sm font-semibold'>
                                            Nama Produk
                                        </div>
                                        <Input
                                            className='mt-2 bg-zinc-100'
                                            value={dataForm.name}
                                            readOnly
                                        />
                                    </div>
                                    <div className=''>
                                        <div className='text-sm font-semibold'>
                                            Harga/satuan
                                        </div>
                                        <Input
                                            className='mt-2 bg-zinc-100'
                                            value={dataForm.price}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 mt-2'>
                                    <div className=''>
                                        <div className='text-sm font-semibold mb-2'>
                                            Jumlah
                                        </div>
                                        <div className='flex gap-2 items-center'>
                                            <Button
                                                size='icon'
                                                variant='secondary'
                                                onClick={() => {
                                                    handleQtyChange({
                                                        target: {
                                                            value:
                                                                dataForm.qty - 1
                                                        }
                                                    })
                                                }}>
                                                <MinusCircle className='h-4 w-4' />
                                            </Button>
                                            <Input
                                                className='max-w-[70px] text-center'
                                                value={dataForm.qty}
                                                onChange={handleQtyChange}
                                            />
                                            <Button
                                                size='icon'
                                                variant='secondary'
                                                onClick={() => {
                                                    handleQtyChange({
                                                        target: {
                                                            value:
                                                                dataForm.qty + 1
                                                        }
                                                    })
                                                }}>
                                                <PlusCircle className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <div className='text-sm font-semibold'>
                                            Discount
                                        </div>
                                        <Input
                                            className='mt-2'
                                            value={dataForm.discount}
                                            onChange={handleDiscountChange}
                                        />
                                    </div>
                                    <div className=''>
                                        <div className='text-sm font-semibold'>
                                            SubTotal
                                        </div>
                                        <Input
                                            className='mt-2'
                                            value={dataForm.subtotal}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant='default'
                                    size='sm'
                                    className='mt-5'
                                    onClick={handleAddProduk}>
                                    Tambah Produk
                                </Button>
                            </div>
                        )}
                        <div className='flex gap-3 items-center my-5'>
                            <h1>Kode Transaksi</h1>
                            <div className='text-blue-700 bg-blue-200 px-3 py-1 rounded-sm text-sm font-bold'>
                                TRX{trxId}
                            </div>
                        </div>
                        <div className='border border-zinc-100 rounded-md mb-2 text-xs p-3 py-1 grid grid-cols-5 items-center'>
                            <div className='font-semibold'>Nama Produk</div>
                            <div className='font-semibold'>Jumlah</div>
                            <div className='font-semibold'>Discount</div>
                            <div className='font-semibold'>Subtotal</div>
                            <div className='font-semibold'>Action</div>
                        </div>

                        {dataTransaksi.produk.map((item: itemTransaksi) => (
                            <div
                                className='border border-zinc-100 rounded-md p-3 grid grid-cols-5 items-center mb-2'
                                key={item.idProduk}>
                                <div className=''>
                                    <div className='font-semibold'>
                                        {item.name}
                                    </div>
                                    <div className='font-semibold text-xs'>
                                        {rupiahFormat(item.price)}
                                    </div>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <Button
                                        size='icon'
                                        variant='secondary'
                                        onClick={() => {
                                            editQtyChange(
                                                item.qty - 1,
                                                item.idProduk
                                            )
                                        }}>
                                        <MinusCircle className='h-4 w-4' />
                                    </Button>
                                    <Input
                                        className='max-w-[50px] text-center'
                                        value={item.qty}
                                    />
                                    <Button
                                        size='icon'
                                        variant='secondary'
                                        onClick={() => {
                                            editQtyChange(
                                                item.qty + 1,
                                                item.idProduk
                                            )
                                        }}>
                                        <PlusCircle className='h-4 w-4' />
                                    </Button>
                                </div>
                                <div className='font-semibold px-3 py-1 rounded-md bg-red-100 text-red-600 w-max text-xs'>
                                    {rupiahFormat(item.discount)}
                                </div>
                                <div className='font-semibold'>
                                    {rupiahFormat(item.subtotal)}
                                </div>

                                <div className='flex gap-3 items-center'>
                                    <Button
                                        size='icon'
                                        variant='destructive'
                                        onClick={() =>
                                            handleDeleteProduk(item.idProduk)
                                        }>
                                        <Trash className='h-4 w-4' />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </Card>
                </div>
                <div className='h-10'>
                    <Card className='p-3'>
                        <div className='mb-1'>
                            <h1 className='font-semibold mb-1'>Total</h1>
                            <div className='text-2xl font-bold text-green-600'>
                                {rupiahFormat(dataTransaksi.total)}
                            </div>
                        </div>
                        <div className='mb-1'>
                            <h1 className='font-semibold mb-1'>Bayar</h1>
                            <Input
                                className=''
                                value={bayar}
                                onChange={handleChangeBayar}
                            />
                        </div>
                        <div className='mb-1'>
                            <h1 className='font-semibold mb-1'>Kembalian</h1>
                            <Input
                                className='bg-zinc-100'
                                readOnly
                                value={kembalian}
                            />
                        </div>
                        <Button
                            className='w-full mt-3'
                            onClick={() => {
                                handleBayar()
                            }}>
                            Bayar
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default KasirPage
