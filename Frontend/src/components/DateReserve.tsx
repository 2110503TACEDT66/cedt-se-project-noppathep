'use client'

import {DateTimePicker} from '@mui/x-date-pickers'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

export default function Form({onDateChange, defaultDate}:{onDateChange:Function, defaultDate:Dayjs|null}){

    const [bookingDate,setBookDate] = useState<Dayjs|null>(defaultDate)

    return(
        <div className="bg-state-100 rounded-lg space-x-5 space-y-2 flex felx-row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker className="bg-white" value={bookingDate} onChange={(value)=>{setBookDate(value);onDateChange(value);}}/>
            </LocalizationProvider>
        </div>
    )
}