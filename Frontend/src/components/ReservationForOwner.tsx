import dayjs from "dayjs";
import { useState } from "react";


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function ReservationForOwner(
    {reservationData}:{reservationData:any}
){
    
    //control order dropdown
    const [isCollapse , setCollapse] = useState(true);
    
    return(
        <div className="bg-slate-50 shadow-md rounded-lg p-3 flex flex-col text-black items-start relative">
            
            
            <div className="flex flex-col flex-nowrap items-start">
                <div>
                    <span><strong>Reserver:</strong> {reservationData.user.name}</span>
                    <span className="bg-gray-200 rounded-full ml-2 p-1 px-2 text-sm font-normal">{reservationData.user._id}</span>
                </div>
                <span><strong>Date:</strong> {dayjs(reservationData.apptDate).format("DD/MM/YYYY HH:mm")}</span>
            </div>


            <div><strong>Order</strong> ({reservationData.foodOrder.length})
                {reservationData.foodOrder.length!=0
                    ?
                    <button onClick={()=>setCollapse(!isCollapse)} className=' hover:underline-offset-4 hover:underline text-blue-500 text-base font-medium'>
                        <ArrowDropDownIcon className={isCollapse?"transition-transform":"rotate-180 transition-transform"} color='info' fontSize='small' />
                        <span className=''>view</span>
                    </button>
                    :''
                }
            </div>


            <div className={
                isCollapse
                ?"mt-1 w-full scale-y-0 origin-top h-0 rounded-b-md"
                :"mt-1 w-full scale-y-100 origin-top h-fit border-t-2 border-gray-300 rounded-b-md transition-transform ease-out"
            }>
                <div className=" font-normal text-sm sm:text-base">
                    {reservationData.foodOrder.map((idx:number,item:any)=>(
                            <div className="w-full px-2 flex flex-nowrap justify-between odd:bg-gray-100 even:bg-gray-50">
                                <div className="w-fit">{item.name}&nbsp;&nbsp;({item.price})</div>
                                <div className="w-fit">{reservationData.foodOrder.filter((elem:any)=>elem.name===item.name)}</div>
                            </div>
                    ))}
                </div>
            </div>


        </div>
    )
}