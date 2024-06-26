"use client"
import DateReserve from '@/components/DateReserve';
import { useEffect, useRef, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import getRestaurants from '@/libs/restaurant/getRestaurants';
import createdReservation from '@/libs/reservation/createdReservation';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { RestaurantModel } from '../../interface';
import Swal from 'sweetalert2';
import InputLabel from '@mui/material/InputLabel';

export default function ReservationForm({profile}:{profile:any}) {

  const [RestaurantsList, setRestaurantsList] = useState<Array<RestaurantModel>>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("finding");
      const Restaurants = await getRestaurants();
      setRestaurantsList(Restaurants.data);
    };
    fetchData();
  }, []);

  const [bookingDate, setBookingDate] = useState(null);
  const [location, setLocation] = useState('');
  const {data:session, status} = useSession()
  const errorMsg = useRef<HTMLParagraphElement>(null); //this use to display error message

  const makeReservation = async () => {

    errorMsg.current!.innerText = ''; //clear any error message on form

    if (bookingDate && location && profile) {

      //confirmation popup first
      Swal.fire({
        title:'Do you want to make this reservation?',
        showCancelButton:true,
        cancelButtonColor:'red',
        confirmButtonText:'Sure',
        confirmButtonColor:'#00A36C'
      }).then(async result=>{
        //then call reservation api
        if(result.isConfirmed){
          try {
            if(session) {
              await createdReservation(location, session.user.token, bookingDate,profile.data._id);
            }
            console.log("Booking dispatched successfully.");
            Swal.fire({title:'Reservation Complete!',text:"You can make your order in 'My Reservation'",icon:'success'})
    
          } catch (error:any) {
            //any error will be display on form
            errorMsg.current!.innerText = error.message;
          }
        }
      })

    } else {
      if(!profile) {
        alert('Please Login before creating reservation')
        return;
      } else {
        errorMsg.current!.innerText = 'Some fields are missing';
        console.error("Some required fields are missing. Booking not dispatched.");
      }
    }
  };

  //get restaurant data by look through RestaurantsList
  const findRestaurantFromId = (id:string) => {
    return RestaurantsList.find(obj => obj._id === id);
  }

  return (
    <main className="flex flex-col items-center w-full">
  
      <div className="w-full px-5 flex flex-wrap flex-row gap-7 justify-center mt-4">

        <form className="bg-white w-[550px] shadow-md rounded px-8 pt-6 pb-8 space-y-4">
          <div>

            <h2 className='text-gray-700 font-semibold text-2xl'>Reserve Seat</h2>
            <h6 className='text-gray-700 font-medium text-sm mb-3'>in the name of <span className='text-blue-500'>{profile.data.name}</span></h6>

            <InputLabel id="restaurant-choices" className="block text-sm font-medium text-gray-700">
              Choose the restaurant
            </InputLabel>
            <div className="mt-2">
              <Select
                labelId='restaurant-choices'
                variant="standard"
                name="location"
                placeholder='Pick a restaurant'
                id="location"
                className="h-[em] w-full"
                value={location}
                onChange={(e)=>{setLocation(e.target.value);
                }}>
                {RestaurantsList?.map((RestaurantItem:any)=>(
                <MenuItem value={RestaurantItem._id}>{RestaurantItem.name}</MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <InputLabel className="block text-sm font-medium text-gray-700">
              Choose your reservation date
            </InputLabel>
            <div className="mt-2 ">
              <DateReserve defaultDate={null} onDateChange={(value:any) => { setBookingDate(value)} } 
              minTime={findRestaurantFromId(location)?.openingHours.open || ""}
              maxTime={findRestaurantFromId(location)?.openingHours.close || ""}/>
            </div>
          </div>

          <p ref={errorMsg} className='text-sm text-red-700'></p>

          <button
            type='button'
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-400"
            onClick={makeReservation} name='Reserve'>
            Reserve now
          </button>

        </form>

        <div className='w-full flex items-center max-w-[650px] min-h-[250px] h-fit bg-gray-100 shadow-sm rounded-md mb-4'>
            {
              findRestaurantFromId(location)
                ? 
                  <div className='p-3 w-full flex flex-col-reverse sm:flex-row items-center sm:items-start'>

                    <div className='w-full h-full pl-2 text-gray-700 text-base'>

                      <Link href={`Restaurant/${location}`} className=' text-gray-800 font-semibold text-2xl'>{findRestaurantFromId(location)?.name}</Link>
                      <p><b>Address:</b> {findRestaurantFromId(location)?.address.district},&nbsp;
                         {findRestaurantFromId(location)?.address.province},&nbsp;
                         {findRestaurantFromId(location)?.address.postalcode}
                      </p>
                      <p><b>Region:</b> {findRestaurantFromId(location)?.address.region}</p>
                      <p><b>Contact:</b> {findRestaurantFromId(location)?.tel}</p>
                      <p><b>Rating:</b> {findRestaurantFromId(location)?.averageRating}</p>
                      <p><b>Opening Hours</b>: {findRestaurantFromId(location)?.openingHours.open} - {findRestaurantFromId(location)?.openingHours.close}</p>
                    
                    </div>

                    <Image src={findRestaurantFromId(location)!.image??'img/placeholder.svg'} alt="restaurant image" width={1280} height={720} className='w-40 sm:w-52 h-auto rounded-md mb-3 sm:mb-0'/>
                  </div>
                : <div className='text-gray-500 w-full font-semibold text-lg text-center'>Please Choose Your Restaurant</div>
            }
        </div>

      </div>
    </main>
  )
}