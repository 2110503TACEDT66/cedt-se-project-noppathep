"use client"
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import deleteReservation from '@/libs/reservation/deleteReservation';
import dayjs from "dayjs";
import { Session } from "next-auth";
import { Button } from "@mui/material";
import { getSession } from 'next-auth/react';
import getUserProfile from '@/libs/user/getUserProfile';
import Dayjs from 'dayjs';
import updateReservation from '@/libs/reservation/updateReservation';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DateReserve from './DateReserve';
import getRestaurants from '@/libs/restaurant/getRestaurants';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ReservationForOwner from './ReservationForOwner';

export default function ReservationList({ reservationJson }: { reservationJson: any }) {
    const [session, setSession] = useState<Session|null>(null);
    const [role, setRole] = useState<string>("");
    const [RestaurantResponse, setRestaurantResponse] = useState<any>(null);
    const reservations = reservationJson;

    useEffect(() => {
        const fetchData = async () => {
            const serverSession = await getSession();
            setSession(serverSession);
            if (serverSession) {
                const profile = await getUserProfile(serverSession.user.token);
                
                setRole(profile.data.role);
            }

            const Restaurants = await getRestaurants();
            setRestaurantResponse(Restaurants);
        };
        fetchData();
    }, []);

    const [bookingDate, setBookingDate] = useState(Dayjs);
    const [location, setLocation] = useState('');

    const [editStates, setEditStates] = useState<{ [key: string]: boolean }>({});
    
    // Function to toggle the editing state for a specific reservation
    const toggleEditState = (reservationId: string) => {
        setEditStates(prevState => ({
            ...prevState,
            [reservationId]: !prevState[reservationId]
        }));
    };

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
                bookingDate,
                location
              )
  
              Swal.fire("Your reservation has been changed", "", "success");
              window.location.reload();
            } 
            else return;
          });
    }

    const handleDelete = async (rid: string) => {
        Swal.fire({
            title: "Do you want to delete this reservation?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteReservation(rid, session?.user.token || "");
                Swal.fire("Reservation Deleted!", "", "success");
                window.location.reload();
            }
        });
    };

    return (
        <div className=" flex flex-col sm:max-w-[700px] sm:mx-auto items-center text-base sm:text-lg bg-slate-200 p-3 rounded-sm">
            <div className="flex min-w-[300px] w-full max-w-[650px] flex-col flex-nowrap gap-y-4">
                {/* {reservations.map((item: any) => (
                    <div key={item._id} className="bg-slate-50 shadow-md rounded-lg p-3 flex flex-col items-start relative">
                        <div className="mb-2">
                            <strong>User ID:</strong> {item.user._id}
                        </div>
                        {
                            editStates[item._id] && RestaurantResponse?.data
                            ?   
                                <div className="mb-2 flex gap-2">
                                    <strong>Restaurant:</strong>
                                    <Select variant="standard" name="location" className="h-[em] w-[200px]" value={location} onChange={(e)=>{setLocation(e.target.value);}} displayEmpty>
                                    {location ? null : (
                                        <MenuItem value="" disabled>
                                            {item.restaurant.name}
                                        </MenuItem>
                                    )}
                                        {RestaurantResponse?.data.map((RestaurantItem:any)=>(
                                        <MenuItem value={RestaurantItem._id}>{RestaurantItem.name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            :   <div className="mb-2">
                                    <strong>Restaurant:</strong> {item.restaurant.name}
                                </div>
                        }
        
                        {
                            editStates[item._id]
                            ?   <div className="mb-2 flex gap-2">
                                    <strong>Date:</strong>
                                    <DateReserve defaultDate={dayjs(item.apptDate)} onDateChange={(value:any) => { setBookingDate(value) }} />
                                </div>
                            :   <div className="mb-2">
                                    <strong>Date:</strong> {dayjs(item.apptDate).format("DD/MM/YYYY HH:mm")}
                                </div>
                        }
                        <div className="mb-2 space-x-3">
                            <strong>Order Count:</strong> {item.foodOrder.length} 
                            <button className=' hover:underline-offset-4 hover:underline text-blue-500 text-base font-medium'><ArrowDropDownIcon color='info' fontSize='small' />
                                <span className=''>view</span>
                            </button>
                        </div>
                        {session && role === "admin" && !editStates[item._id] 
                        ? (
                            <div className='absolute right-2 bottom-2 flex gap-1'>
                                <button
                                    className="rounded-md bg-orange-600 hover:bg-orange-700 px-2 py-1 text-white shadow-sm"
                                    onClick={() => toggleEditState(item._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="block rounded-md bg-red-600 hover:bg-red-700 px-2 py-1 text-white shadow-sm"
                                    onClick={() => handleDelete(item.restaurant)}
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div className='absolute right-2 bottom-2 flex gap-1'>
                                <button
                                    className='text-sm text-white font-normal bg-green-600 hover:bg-green-700 rounded-md px-2 p-1'
                                    onClick={ ()=>{editReservation(item._id); toggleEditState(item._id)}}
                                >
                                    Confirm
                                </button>
                                <button
                                    className='text-sm text-white font-normal bg-red-500 hover:bg-red-600 rounded-md px-2 p-1'
                                    onClick={() => toggleEditState(item._id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))} */}

                {
                    reservations.map((item:any)=>(
                        <ReservationForOwner reservationData={item} />
                    ))
                }

                


            </div>
        </div>
    );
}
