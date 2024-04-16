import Link from "next/link";
import dayjs from "dayjs";

export default async function ReservationList({reservationJson}:{reservationJson:any}){
    const reservations = await reservationJson 
    return(
        <>
        <div className="w-full flex flex-col bg-slate-100 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
                reservations.map((item:any)=>(
                            <div className="bg-slate-200 rounded-lg p-3 flex flex-col items-start">
                                <div>
                                    userID : {item.user}
                                </div>
                                <div>
                                    date : {dayjs(item.apptDate).format("DD/MM/YYYY HH:mm")}
                                </div>
                                <div>
                                    order count : { item.foodOrder.length }
                                </div>
                            </div>
                ))
            }
        </div>
      </div>
        </>
    )
}