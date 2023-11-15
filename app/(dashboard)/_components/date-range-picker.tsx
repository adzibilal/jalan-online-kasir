'use client'

import * as React from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

interface DatePickerWithRangeProps {
    className?: string
    startDate: Date
    endDate: Date
    onChange: (startDate: Date, endDate: Date) => void
}

export function DatePickerWithRange({
    className,
    startDate,
    endDate,
    onChange
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: startDate,
        to: endDate
    })

    const handleChange = () => {
        if (date?.from) {
            onChange(date.from, date.to || addDays(date.from, 0))
        }
    }

    return (
        <>
            <div className={cn('grid gap-2', className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id='date'
                            variant={'outline'}
                            className={cn(
                                'w-[300px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y')} -{' '}
                                        {format(date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0 mr-5' align='start'>
                        <Calendar
                            initialFocus
                            mode='range'
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        <div className='p-3'>
                            <Button className='w-full' onClick={handleChange} variant='default'>
                                Terapkan Filter
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}
