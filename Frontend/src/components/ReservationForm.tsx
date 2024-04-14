"use client"
import DateReserve from '@/components/DateReserve';
import { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import getRestaurants from '@/libs/getRestaurants';
import createdReservation from '@/libs/createdReservation';
import { getSession, useSession } from 'next-auth/react';

export default function ReservationForm({profile}:{profile:any}) {

  const [RestaurantResponse, setRestaurantResponse] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("finding");
      const Restaurants = await getRestaurants();
      setRestaurantResponse(Restaurants);
    };
    fetchData();
  }, []);

  const [bookingDate, setBookingDate] = useState(null);
  const [location, setLocation] = useState('');
  const {data:session, status} = useSession()

  const makeReservation = async () => {
    
    if (bookingDate && location && profile) {
      try {
        if(session) {
          await createdReservation(location, session.user.token, bookingDate,profile.data._id);
        } 
        console.log("Booking dispatched successfully.");
        alert("Reservation booking complete")
      } catch (error) {
        console.error("Failed to dispatch booking:", error);
      }
    } else {
      if(!profile) {
        alert('Please Login befor creating reservation')
        return;
      } else {
        console.error("Some required fields are missing. Booking not dispatched.");
      }
    }
  };

  return (
    <main className="flex flex-col items-center pt-6 pl-6 w-full">
      <div className="text-xl font-medium mt-6">{profile ? "Reserve seat in the name of "   + profile.data.name : "Please login to make reservation"}</div>
      <div className="w-full max-w-sm">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Please choose the restaurant
            </label>
            <div className="mt-2">
              <Select
                variant="standard"
                name="location"
                id="location"
                className="h-[em] w-[200px]"
                value={location}
                onChange={(e)=>{setLocation(e.target.value);
                }}>
                {RestaurantResponse?.data.map((RestaurantItem:any)=>(
                <MenuItem value={RestaurantItem._id}>{RestaurantItem.name}</MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose your reservation date
            </label>
            <div className="mt-2 ">
              <DateReserve defaultDate={null} onDateChange={(value:any) => { setBookingDate(value) }} />
            </div>
          </div>
          <div>
            <button
              type='button'
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-400"
              onClick={makeReservation} name='Reserve'>
              Reserve My Seat now!!!
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}