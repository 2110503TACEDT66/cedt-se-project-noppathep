"use client"
import DateReserve from '@/components/DateReserve';
import { useEffect, useRef, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import getRestaurants from '@/libs/restaurant/getRestaurants';
import getTables from '@/libs/table/getTables';
import createdReservation from '@/libs/reservation/createdReservation';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { RestaurantModel } from '../../interface';
import Swal from 'sweetalert2';

export default function ReservationForm({profile}:{profile:any}) {

  const [RestaurantsList, setRestaurantsList] = useState<Array<RestaurantModel>>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("finding");
      const Restaurants = await getRestaurants();
      //const Table = await getTables(Restaurants._id);
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
            Swal.fire({title:'Reservation Complete!',text:"You can make your order in 'my Reservation'",icon:'success'})
    
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

            <label className="block text-sm font-medium text-gray-700">
              Choose the restaurant
            </label>
            <div className="mt-2">
              <Select
                variant="standard"
                name="location"
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
            <label className="block text-sm font-medium text-gray-700">
              Choose your reservation date
            </label>
            <div className="mt-2 ">
              <DateReserve defaultDate={null} onDateChange={(value:any) => { setBookingDate(value)} } />
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

        <div className='w-full flex items-center max-w-[600px] min-h-[250px] h-fit bg-gray-100 shadow-sm rounded-md mb-4'>
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
                      <p><b>Opening Hours</b>: {findRestaurantFromId(location)?.openingHours.open} - {findRestaurantFromId(location)?.openingHours.close}</p>
                      <p style={{ margin: '20px 0' }}></p>
                      <p><b>The table available:</b> {findRestaurantFromId(location)?.tables}</p>
                      <div className=' max-w-[600px]  h-fit bg-white shadow-sm rounded-md mb-4'>
                        <div className='w-full flex items-center justify-between min-h-[75px]'>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                        </div>
                        <div className='w-full flex items-center justify-between min-h-[75px]'>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                          <div className='w-[calc(20%-10px)] h-[60px] bg-gray-200 rounded-md'style={{ margin: '10px' }}></div>
                        </div>
                      </div>
                    </div>
                    <Image src={findRestaurantFromId(location)!.image} alt="restaurant image" width={1280} height={720} className='w-40 sm:w-52 h-auto rounded-md mb-3 sm:mb-0'/>
                  </div>
                : <div className='text-gray-500 w-full font-semibold text-lg text-center'>Please Choose Your Restaurant</div>
            }
        </div>

      </div>
    </main>
  )
}