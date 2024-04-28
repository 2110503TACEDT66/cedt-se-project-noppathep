"use client"

import { useEffect } from 'react';
import ReservationForOwner from './ReservationForOwner';

export default function ReservationList({ dataJson }: { dataJson: any }) {


    return (
        <div className=" flex flex-col sm:max-w-[700px] sm:mx-auto items-center text-base sm:text-lg bg-slate-200 p-3 rounded-sm">
            <div className="flex min-w-[300px] w-full max-w-[650px] min-h-[350px] overflow-y-auto flex-col flex-nowrap gap-y-4">
                {
                    dataJson.reservations.map((item:any,idx:number)=>(
                        <ReservationForOwner key={idx} reservationData={item} restaurantData={dataJson}/>
                    ))
                }
            </div>
        </div>
    );
}
