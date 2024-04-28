import dayjs from "dayjs";
import  Dayjs  from 'dayjs';
import { useState } from "react";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import Foodorder from "@/app/(orderingfood)/Orderfood/[rid]/page";
import Swal from "sweetalert2";
import deleteReservation from "@/libs/reservation/deleteReservation";
import { getSession, useSession } from "next-auth/react";
import updateReservation from "@/libs/reservation/updateReservation";
import DateReserve from "./DateReserve";

interface foodItem{
    name:string,
    price:number,
    amount:number
}

export default function ReservationForOwner(
    {reservationData}:{reservationData:any}
){
    const {data:session , status} = useSession();
    //control order dropdown
    const [isCollapse , setCollapse] = useState(true);
    
    
    var uniqueFoodList:Map<string,foodItem> = new Map<string,foodItem>();
    if(reservationData.foodOrder.length !== 0){
        
        reservationData.foodOrder.forEach((current:any)=>{
            if(uniqueFoodList.has(current._id)){
                uniqueFoodList.get(current._id)!.amount+=1;
            }
            else{
                let newFood:foodItem = {
                    name:current.name,
                    price:current.price,
                    amount:1
                };
                uniqueFoodList.set(current._id,newFood);
            }
        })
        
    }
  
    //state for updating reservation
    const [bookingDate, setBookingDate] = useState(Dayjs);
    const [editStates, setEditStates] = useState<boolean>(false);


    //delete reservation
    const handleDelete = async (rid: string) => {
        Swal.fire({
            title: "Do you want to delete this reservation?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed && session?.user.token) {
                await deleteReservation(rid, session.user.token);
                Swal.fire("Reservation deleted!", "", "success");
                window.location.reload();
            }
        });
    };

    //edit date of reservation
    const editReservation = async () => {
        Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            
            confirmButtonText: "Save"
          }).then((result) => {
            if (result.isConfirmed && session != null) {
                
                updateReservation(
                    reservationData._id,
                    session.user.token,
                    bookingDate
                )
                .then(()=>{
                    Swal.fire("Your reservation has been changed", "", "success");
                    window.location.reload();
                })
                .catch((error)=>{
                    Swal.fire(error.message,"","info");
                    return;
                })
            } 
            else return;

          });
    }

        
    // return(
    //     <div className="bg-slate-50 h-32 shadow-md rounded-lg p-3 flex flex-col text-black items-start relative">
    //         <div className="flex flex-col flex-nowrap items-start w-full gap-y-2 animate-pulse">
    //             <div className="bg-gray-200 w-44 h-6 rounded-md"></div>
    //             <div className="bg-gray-200 w-3/4 sm:w-1/2 h-16 rounded-md"></div>
    //         </div>
    //     </div>
    // )

    return(
        <div className="bg-slate-50 shadow-md rounded-lg p-3 flex flex-col text-black items-start relative">
            
            
            <div className="flex flex-col flex-nowrap items-start w-full">

                <div className="w-full flex justify-between mb-1 ">
                    <span className="font-normal h-fit self-center leading-none p-1 px-2 text-sm text-slate-50 bg-teal-700 rounded-md">{reservationData._id}</span>
                    <button onClick={()=>handleDelete(reservationData._id)} className="hover:[&>_]:bg-gray-300">
                        <DeleteIcon fontSize="inherit" className="rounded-full size-7 p-1 transition-colors" />
                    </button>
                </div>

                <div>
                    <span><strong>Reserver:</strong> {reservationData.user.name}</span>
                    <span className="bg-gray-200 rounded-full ml-2 p-1 px-2 text-xs font-normal">{reservationData.user._id}</span>
                </div>

                <span className="space-x-2 flex items-center">
                    
                    <strong>Date:</strong> 
                    
                    {   //switching between normal-editing mode
                        editStates
                        ?   <DateReserve defaultDate={dayjs(reservationData.apptDate)} onDateChange={(value:any) => { setBookingDate(value) }} />
                        :   <>{dayjs(reservationData.apptDate).format("DD/MM/YYYY HH:mm")}</>
                    }
                    
                    {   //switching between normal-editing mode
                        editStates
                        ?   <span>
                                <button onClick={ ()=>setEditStates(prev=>!prev) } className="hover:[&>_]:bg-gray-300">
                                    <DisabledByDefaultIcon fontSize="inherit" className="size-8 rounded-full p-1 text-gray-700 transition-colors"/>
                                </button>
                                <button onClick={()=>editReservation()} className="hover:[&>_]:bg-gray-300">
                                    <CheckBoxIcon fontSize="inherit" className="size-8 rounded-full p-1 text-green-700 transition-colors"/>
                                </button>
                            </span>
                        :   <button onClick={ ()=>setEditStates(prev=>!prev) } className="hover:[&>_]:bg-gray-300">
                                <EditIcon fontSize="inherit" className="size-6 rounded-full p-1 text-gray-700 transition-colors" />
                            </button>
                    }
    
                </span>
            
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
                isCollapse && Foodorder.length!=0
                ?"mt-1 w-full scale-y-0 origin-top h-0 rounded-b-md"
                :"mt-1 w-full scale-y-100 origin-top h-fit border-t-2 border-gray-300 rounded-b-md transition-transform ease-out"
            }>
                <div className=" font-normal text-sm sm:text-base">

                    {
                        Array.from( uniqueFoodList ).map(([key, value]) => (
                            <div key={key} className="w-full px-2 flex flex-nowrap justify-between odd:bg-gray-100 even:bg-gray-50">
                                <div className="w-fit">{value.name}&nbsp;&nbsp;({value.price} ฿)</div>
                                <div className="w-fit">x{value.amount}</div>
                            </div>
                        ))
                    }

                </div>
            </div>


        </div>
    )
}