'use client'

import {DateTimePicker} from '@mui/x-date-pickers'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

export default function Form({onDateChange, defaultDate, minTime, maxTime}:{onDateChange:Function, defaultDate:Dayjs|null, minTime:string, maxTime:string}){

    const [bookingDate,setBookDate] = useState<Dayjs|null>(defaultDate);
    const today = dayjs();

    return(
        <div className="bg-state-100 rounded-lg space-x-5 space-y-2 flex felx-row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker label="Pick a time" className="bg-white" value={bookingDate} 
                onChange={(value)=>{setBookDate(value);onDateChange(value);}} minDate={today.add(1, 'day')}
                minTime={today.hour(parseInt(minTime.split(':')[0])).minute(parseInt(minTime.split(':')[1]))}
                maxTime={today.hour(parseInt(maxTime.split(':')[0])).minute(parseInt(maxTime.split(':')[1]))}
                ampm={false}
                skipDisabled
                />
            </LocalizationProvider>
        </div>
    )
}