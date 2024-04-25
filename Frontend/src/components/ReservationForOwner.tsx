import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Foodorder from "@/app/(orderingfood)/Orderfood/[rid]/page";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import deleteReservation from "@/libs/reservation/deleteReservation";
import { getSession, useSession } from "next-auth/react";
import getUserProfile from "@/libs/user/getUserProfile";

interface foodItem{
    name:string,
    price:number,
    amount:number
}

export default function ReservationForOwner(
    {reservationData}:{reservationData:any}
){
    const {data:session , status} = useSession();
    const ownerId = useRef<string>("");
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
     
            console.log(uniqueFoodList);
        }
    


    //delete reservation
    const handleDelete = async (rid: string) => {
        Swal.fire({
            title: "Do you want to delete this reservation?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteReservation(rid, ownerId.current);
                Swal.fire("Reservation Deleted!", "", "success");
                window.location.reload();
            }
        });
    };

    
    useEffect(()=>{
        const fetchUserData = async ()=> {
            const res = await getUserProfile(session!.user.token);
            ownerId.current = res.data._id;
        }
        fetchUserData();
    },[]);
        

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

                <span className="space-x-2">
                    <strong>Date:</strong> {dayjs(reservationData.apptDate).format("DD/MM/YYYY HH:mm")}
                    <EditIcon fontSize="inherit" className="size-4 text-gray-700" />
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