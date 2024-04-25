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
            <div className="flex min-w-[300px] w-full max-w-[650px] min-h-[350px] overflow-y-auto flex-col flex-nowrap gap-y-4">
                {
                    reservations.map((item:any,idx:number)=>(
                        <ReservationForOwner key={idx} reservationData={item}/>
                    ))
                }
            </div>
        </div>
    );
}
