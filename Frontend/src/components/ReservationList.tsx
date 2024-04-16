import Link from "next/link";
import dayjs from "dayjs";

export default async function ReservationList({reservationJson}:{reservationJson:any}){
    const reservations = await reservationJson 
    return(
        <>
        <div style={{margin:"20px", display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around",alignContent:"space-around"}}>
        {
            reservations.map((item:any)=>(
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-200 rounded-md p-3 flex flex-col items-start">
                            <div>
                                userID : {item.user}
                            </div>
                            <div>
                                date : {dayjs(item.apptDate).format("DD/MM/YYYY HH:mm")}
                            </div>
                        </div>
                    </div>
            ))
        }
      </div>
        </>
    )
}