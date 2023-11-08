import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

//rupiah format
export function rupiahFormat(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}

//date format
export function dateFormat(inputDate: Date | null) {
    if (!inputDate) return '-'
    // Parse the input date string into a Date object
    const parsedDate = new Date(inputDate)

    // Define the months in your desired language (e.g., German)
    const months = [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ]

    // Extract day, month, year, hours, and minutes
    const day = parsedDate.getUTCDate()
    const month = months[parsedDate.getUTCMonth()]
    const year = parsedDate.getUTCFullYear()
    const hours = parsedDate.getUTCHours()
    const minutes = parsedDate.getUTCMinutes()

    // Create the formatted date string
    const outputDate = `${day} ${month} ${year}, ${hours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    return outputDate
}
