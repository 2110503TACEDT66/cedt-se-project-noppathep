'use client'
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import  getReservations  from '@/libs/reservation/getReservations';
import deleteReservation from '@/libs/reservation/deleteReservation';
import LinearProgress from '@mui/material/LinearProgress';
import updateReservation from '@/libs/reservation/updateReservation';
import Select from '@mui/material/Select';
import Profile from './Profile';

import Swal from 'sweetalert2'

import MenuItem from '@mui/material/MenuItem';
import getRestaurants from '@/libs/restaurant/getRestaurants';
import DateReserve from './DateReserve';
import  Dayjs  from 'dayjs';
import { useRouter } from 'next/navigation';
import { Close, Edit } from '@mui/icons-material';
import Link from 'next/link';
import updateUserProfile from '@/libs/user/updateUserProfile';
import dayjs from 'dayjs';
import payReservation from '@/libs/reservation/payReservation';

export default function MyReservation({profile}:{profile:any}) {

    const router = useRouter()

    const { data: session, status } = useSession();
    const [allReservation, setAllReservation] = useState<any>(null);

    const [RestaurantResponse, setRestaurantResponse] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
        // console.log("finding");
        const Restaurants = await getRestaurants();
        setRestaurantResponse(Restaurants);
        const reservations = await getReservations(session?.user.token || "");
        setAllReservation(reservations.data);
      };
      fetchData();
    }, []);
  
    const [bookingDate, setBookingDate] = useState(Dayjs);

    const removeReservation = async (rid:string)=>{

        Swal.fire({
            title: "Do you want to cancel this reservation?",
            text:"this action cannot be reverted",
            showConfirmButton:true,
            confirmButtonColor: "#d33",
            showCancelButton: true,
            confirmButtonText: "Sure, cancel now",
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await deleteReservation(rid , session?.user.token || "");
                Swal.fire("Reservation Deleted!", "", "success");
                window.location.reload();
            } else return;
          });

        
    }
    //=======================================================

    const [editStates, setEditStates] = useState<{ [key: string]: boolean }>({});
    
    // Function to toggle the editing state for a specific reservation
    const toggleEditState = (reservationId: string) => {
        setEditStates(prevState => ({
            ...prevState,
            [reservationId]: !prevState[reservationId]
        }));
    };

    const handleShowRating = (rating:any, comment:any) => {
        Swal.fire({
            title: 'Your Rating Comment',
            text: `You rated ${rating} stars and says: ${comment}`,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    }

    //edit date of reservation
    const editReservation = async (itemID:string) => {
        Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            
            confirmButtonText: "Save"
          }).then((result) => {
            if (result.isConfirmed && session != null) {
                
                updateReservation(
                    itemID,
                    session.user.token,
                    bookingDate
                )
                .then(()=>Swal.fire("Your reservation has been changed", "", "success"))
                .catch((error)=>{
                    Swal.fire(error.message,"","info");
                    return;
                })
            } 
            else return;

          });
    }

    //mark reservation as 'paid' by calling backendAPI using payReservation() (for now)
    const handlePayReservation = async (reservationId:string) =>{
        Swal.fire({
            title: "Pay a reservation?",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor:"green"

          }).then((result) => {

            if (result.isConfirmed && session != null) {
                payReservation(reservationId,session.user.token)
                    .then((res)=>{
                        //success popup
                        Swal.fire("Your payment has been recieved", `${res.message}</br>make sure to arrive in time!`, "success")
                        .then((result) =>{
                            if(result.isDismissed ||result.isConfirmed){
                                window.location.reload();
                            }
                        });
                    })
                    .catch((err)=>{
                        //error popup
                        Swal.fire("ERROR",err.message, "error");
                    });

            } 
            else return;
          });
    }

    //just for date formatting
    function formatDate(time: Date | number): string {
        const months: string[] = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        let dateObj: Date = new Date(time);
        // dateObj.setHours(dateObj.getHours() - 7); // why?
    

        const day: string = ('0' + dateObj.getDate()).slice(-2);
        const monthIndex: number = dateObj.getMonth();
        const month: string = months[monthIndex];
        const year: number = dateObj.getFullYear();
        const hour: string = ('0' + dateObj.getHours()).slice(-2);
        const minute: string = ('0' + dateObj.getMinutes()).slice(-2);
        return `${day} ${month} ${year} ${hour}:${minute}`;
    }

    //waiting for fetched data
    if(!allReservation){return <p>Loading ... <LinearProgress/></p>}


    return (
        <div className=''>
            <div className='flex flex-col xl:py-5 xl:flex-row mt-4 gap-5 items-center justify-around'>
                
            <Profile profile={profile} />

                {   //if have no reservation, display blank page + suggest to make a reserve
                    allReservation.length > 0
                        ?
                            <div className='flex flex-col gap-y-4 w-full md:w-[720px] bg-slate-200 p-2 items-center sm:mx-4 rounded-sm'>
                            
                            {   //display all current reservations of this user
                                allReservation.map((item: any,index:number) => 
                                (
                                    <div key={index} className='bg-slate-50 shadow-md w-full h-[220px] md:w-[700px] md:h-[220px] rounded-md'>
                                        <div className='h-full w-full flex flex-row items-center px-5'>
                                            
                                            <Image
                                                src= {item.restaurant.image??'img/placeholder.svg'}
                                                alt={"Image"}
                                                width={150}
                                                height={150}
                                                priority={true}
                                                className="size-14 self-start sm:self-center mt-12 rounded-full sm:mt-0 sm:rounded-sm sm:size-[150px]"
                                            />
                                        
                                            <div className='w-full flex flex-col gap-2 pt-3 pl-3 pb-3 relative'>

                                                {   //switching between normal-editing mode
                                                    !editStates[item._id] && !item.paid &&
                                                    <button className='ml-auto w-fit h-fit py-0 absolute right-0' onClick={(e) => {toggleEditState(item._id); setBookingDate(item.apptDate);}}>
                                                        <Edit fontSize='medium' sx={{ color: "black" }} />
                                                    </button>
                                                }

                                                <Link href={`Restaurant/${item.restaurant.id}`} className='w-fit max-w-[80%] text-left text-base sm:text-lg font-semibold text-teal-700 underline hover:text-teal-900'>
                                                        {item.restaurant.name}
                                                </Link>
                                                
                                                {   //switching between normal-editing mode
                                                    editStates[item._id]
                                                    ?   <DateReserve defaultDate={dayjs(item.apptDate)} onDateChange={(value:any) => { setBookingDate(value) }}
                                                            minTime={item.openingHours.open} maxTime={item.openingHours.close}
                                                        />
                                                    :   <div className='text-left text-sm font-medium text-gray-600'>
                                                            Reservation Date: {formatDate(item.apptDate)}
                                                        </div>
                                                }

                                                {   
                                                    !editStates[item._id] &&
                                                    <div className='text-left text-sm font-medium text-gray-600'>
                                                        Food Order count: {item.foodOrder.length}
                                                    </div>
                                                }

                                                {
                                                    !editStates[item._id] &&
                                                    <div className='text-left text-sm font-medium text-gray-600'>
                                                        Table pick count: {item.reserveTable.length}
                                                    </div>
                                                }
                                
                                                <div className='text-left text-sm font font-medium text-gray-600'>
                                                    Status:&nbsp;
                                                        {   //display reservation status
                                                            item.paid
                                                            ?<span className='font-semibold text-orange-600'>pending arrival</span>
                                                            :<span className='font-semibold'>waiting for payment</span>
                                                        }
                                                </div>


                                            {   //switching between normal-editing mode
                                                editStates[item._id]
                                                ?   <div className='ml-auto flex flex-row gap-2 text-white [&>button]:max-h-9 [&>button]:font-semibold [&>button]:rounded-md [&>button]:shadow-sm'>

                                                        <button onClick={ ()=>{editReservation(item._id); toggleEditState(item._id)}} 
                                                            className=' bg-green-600 hover:bg-green-700 px-2 p-1'>
                                                            Save
                                                        </button>

                                                        <button onClick={ ()=>toggleEditState(item._id) } 
                                                            className=' bg-red-500 hover:bg-red-600 px-2 p-1'>
                                                            Cancel Editing
                                                        </button>
                                                        
                                                    </div>
                                                    
                                                :   <div className='ml-auto flex flex-row gap-2 text-gray-50 [&>button]:max-h-9 [&>button]:font-semibold [&>button]:rounded-md [&>button]:shadow-sm '>

                                     
                                                            {   //appear after rated
                                                                item.rating != null && !editStates[item._id]
                                                                &&(
                                                                    <button className='bg-yellow-500 hover:bg-yellow-700 px-2 py-1'
                                                                    onClick={(e) => handleShowRating(item.rating.rating, item.rating.comment)}>
                                                                        view score
                                                                    </button>
                                                                )
                                                            }
                                     

                                                        {   //only when paid, disappear after rated once
                                                            item.rating == null && item.paid && (
                                                                <button className=" bg-yellow-500 hover:bg-yellow-700 px-2 py-1 " 
                                                                        onClick={()=>{router.push(`/myreservation/${item._id}/rate`)}}
                                                                >
                                                                    Rate
                                                                </button>
                                                            )
                                                        }



                                                        {   //PAY BUTTON only when reservation not yet paid
                                                            (!item.paid) &&
                                                            <button className=" bg-green-600 hover:bg-green-700 px-5 py-1" 
                                                                onClick={()=>{handlePayReservation(item._id)}}>Pay
                                                            </button>
                                                        }

                                                        <button className="rounded-md bg-orange-500 hover:bg-orange-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>{router.push(`/Table/${item._id}`)}}>
                                                            Pick Table
                                                        </button>

                                                        {   //ORDER BUTTON only when reservation not yet paid
                                                            (!item.paid) &&
                                                            <button className=" bg-slate-400 hover:bg-slate-600 px-2 py-1 " 
                                                                onClick={()=>{router.push(`/Orderfood/${item._id}`)}}>
                                                                Order
                                                            </button>
                                                        }

                                                        <button className=" bg-red-600 hover:bg-red-700 px-2 py-1 " 
                                                                onClick={()=>removeReservation(item._id)}
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>
                                            }

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                            
                        :   <div className="w-[95%] md:max-w-[700px] h-72 flex flex-col flex-nowrap items-center justify-center gap-y-3 bg-slate-200 mx-5 ">
                                <div className='text-lg text-slate-600'>You have no reservation</div>
                                <Link href={'/reservation'} className='w-fit text-xl font-medium bg-purple-500 hover:bg-purple-600 p-2 rounded-md text-white'>
                                    Make some reservation !
                                </Link>
                            </div>
                }
            </div>
        </div>
        
    );
}
