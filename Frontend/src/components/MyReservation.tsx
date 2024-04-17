'use client'
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import  getReservations  from '@/libs/reservation/getReservations';
import deleteReservation from '@/libs/reservation/deleteReservation';
import LinearProgress from '@mui/material/LinearProgress';
import updateReservation from '@/libs/reservation/updateReservation';
import Select from '@mui/material/Select';
import { Button, Input } from '@mui/material';

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
    const [location, setLocation] = useState('');

    //==================<profile editing>====================
    const [isEditProfile , setEditProfile] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(profile.data.name);
    const [newEmail, setNewEmail] = useState<string>(profile.data.email);
    const [newTel, setNewTel] = useState<string>(profile.data.telephone);
    const [newCard, setNewCard] = useState<string>('');

    const editProfile = ()=>{
        
        Swal.fire({
          title: "Do you want to save the changes?",
          showCancelButton: true,
          
          confirmButtonText: "Save"
        }).then((result) => {
          if (result.isConfirmed && session != null) {

            updateUserProfile(
                session?.user._id,
                session?.user.token,
                newName,
                newEmail,
                newTel,
                newCard
            );

            Swal.fire("Your profile has been changed", "", "success");
            setEditProfile(false)
          } 
          else return;
        });

    
    }
    //=======================================================

    //==================<profile editing>====================
    const removeReservation = async (rid:string)=>{

        Swal.fire({
            title: "Do you want to delete this reservation?",
            showConfirmButton:true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
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
                
                {profile && (
                    <div className="w-full  md:max-w-[700px] h-full xl:self-start xl:ml-5 p-2 border-2 border-gray-100 text-black shadow-lg" 
                         key={profile.data.id}
                    >

                        <table className='w-full'>
                            <tbody className='[&>tr>th]:text-start [&>tr>th]:px-4 [&>tr>th]:w-44 sm:[&>tr>th]:w-52 sm:[&>tr>td]:w-96 [&>tr]:h-11'>
                                <th colSpan={2} className='relative text-2xl font-semibold text-start sm:text-center p-2'>
                                    User Profile
                                        {
                                            isEditProfile
                                                ?
                                                <span className='absolute right-2 space-x-2'>
                                                    <button onClick={ ()=>editProfile() } className='text-sm text-white font-normal bg-green-600 hover:bg-green-700 rounded-md px-2 p-1'>
                                                        save
                                                    </button>
                                                    <button onClick={ ()=>setEditProfile(false) } className='text-sm text-white font-normal bg-red-500 hover:bg-red-600 rounded-md px-2 p-1'>
                                                        cancel editing
                                                    </button>
                                                </span>
                                                :
                                                <span className='absolute right-2 space-x-2'>
                                                    <button onClick={ ()=>setEditProfile(true) } className='text-sm text-gray-700 font-normal bg-gray-200 hover:bg-gray-300 rounded-md px-2 p-1'>
                                                        Edit profile    
                                                    </button>    
                                                </span>
                                        }
                                </th>

                                <tr>
                                    <th>Name</th>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewName(event.target.value)} placeholder={newName}/>
                                            : <>{newName}</>
                                        }
                                    </td>
                                </tr>
                                
                                <tr>
                                    <th>Email</th>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewEmail(event.target.value)} placeholder={newEmail}/>
                                            : <>{newEmail}</>
                                        }
                                    </td>
                                </tr>

                                <tr>
                                    <th>Tel.</th>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewTel(event.target.value)} placeholder={newTel}/>
                                            : <>{newTel}</>
                                        }
                                    </td>
                                </tr>

                                <tr>
                                    <th>Credit/Debit Card</th>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewCard(event.target.value)} placeholder={newCard} />
                                            : <>{newCard}</>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Points</th>
                                    <td>9999</td>
                                </tr>
                                <tr>
                                    <th>Member since</th>
                                    <td>{formatDate(profile.data.createdAt)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {
                    allReservation.length > 0
                        ?
                            <div className='flex flex-col gap-y-4 w-full md:w-[720px] bg-slate-200 p-2 items-center sm:mx-4 rounded-sm'>
                            {
                                allReservation.map((item: any) => 
                                (
                                    <div className='bg-slate-50 shadow-md w-full md:w-[700px] h-[200px] rounded-md'>
                                        <div className='h-full w-full flex flex-row items-center px-5'>
                                            
                                            <Image
                                                src= {"/img/thaispice.jpg"}
                                                alt={"Image"}
                                                width={150}
                                                height={100}
                                                className="size-14 self-start sm:self-center mt-12 rounded-full sm:mt-0 sm:rounded-none sm:w-[150px] sm:h-auto"
                                            />
                                        
                                            <div className='w-full flex flex-col gap-2 pl-3 pb-3'>

                                                {
                                                    !editStates[item._id] &&
                                                    <button className='ml-auto w-fit h-fit py-0' onClick={(e) => {toggleEditState(item._id); setLocation(item.restaurant._id); setBookingDate(item.apptDate);}}>
                                                        <Edit fontSize='medium' sx={{ color: "black" }} />
                                                    </button>
                                                }
                                
                                                {
                                                    editStates[item._id] 
                                                    ?   <Select variant="standard" name="location" className="h-[em] w-[200px]" value={location} onChange={(e)=>{setLocation(e.target.value);}} displayEmpty>
                                                        {location ? null : (
                                                            <MenuItem value="" disabled>
                                                                {item.restaurant.name}
                                                            </MenuItem>
                                                        )}
                                                             {RestaurantResponse?.data.map((RestaurantItem:any)=>(
                                                            <MenuItem value={RestaurantItem._id}>{RestaurantItem.name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    :   <Link href={`Restaurant/${item.restaurant.id}`}>
                                                            <div className='text-left text-lg font-semibold  text-teal-700 underline hover:text-teal-900'>
                                                                Restaurant: {item.restaurant.name}
                                                            </div>
                                                        </Link>
                                                }
                                
                                                {
                                                    editStates[item._id]
                                                    ?   <DateReserve defaultDate={dayjs(item.apptDate)} onDateChange={(value:any) => { setBookingDate(value) }} />
                                                    :   <div className='text-left text-sm font-medium text-gray-600'>
                                                            Reservation Date: {formatDate(item.apptDate)}
                                                        </div>
                                                }

                                                <div className='text-left text-sm font-medium text-gray-600'>
                                                    Food Order count: {item.foodOrder.length}
                                                </div>
                                
                                            {
                                                editStates[item._id]
                                                ?   <div className='ml-auto flex flex-row gap-2'>
                                                        <button onClick={ ()=>{editReservation(item._id); toggleEditState(item._id)}} 
                                                        className='text-sm text-white font-normal bg-green-600 hover:bg-green-700 rounded-md px-2 p-1'>
                                                            Save
                                                        </button>
                                                        <button onClick={ ()=>toggleEditState(item._id) } 
                                                        className='text-sm text-white font-normal bg-red-500 hover:bg-red-600 rounded-md px-2 p-1'>
                                                            Cancel Editing
                                                        </button>
                                                    </div>
                                                :   <div className='ml-auto flex flex-row gap-2'>
                                                        <button className="rounded-md bg-orange-600 hover:bg-orange-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>{router.push(`/Orderfood/${item._id}`)}}
                                                        >
                                                            Order
                                                        </button>
                                                        <button className="block rounded-md bg-red-600 hover:bg-red-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>removeReservation(item._id)}
                                                        >
                                                            Cancel Reservation
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
