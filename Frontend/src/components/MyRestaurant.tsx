'use client'
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import Swal from 'sweetalert2'

import getRestaurants from '@/libs/restaurant/getRestaurants';
import { useRouter } from 'next/navigation';
import { Close, Edit } from '@mui/icons-material';
import Link from 'next/link';
import deleteRestaurant from '@/libs/restaurant/deleteRestaurant';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Profile from './Profile';

export default function MyRestaurant({profile}:{profile:any}) {

    const router = useRouter()

    const { data: session, status } = useSession();

    const [allRestaurant, setAllRestaurant] = useState<any>(null);
    const [ownedRestaurant, setOwnedRestaurant] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
        console.log("finding");
        const Restaurants = await getRestaurants();
        setAllRestaurant(Restaurants);
        setOwnedRestaurant(Restaurants.data.filter((item: any) => item.owner === profile.data._id))
        console.log(Restaurants);
      };
      fetchData();
    }, []);

    const removeRestaurant = async (rid:string)=>{

        Swal.fire({
            title: "Do you want to delete this restaurant?",
            showConfirmButton:true,
            showCancelButton: true,
            confirmButtonText: "Sure, delete it",
            cancelButtonColor: "#d33"
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await deleteRestaurant(session!.user.token, rid);
                Swal.fire("Restaurant Deleted!", "", "success");
                window.location.reload();
            } else return;
          });

        
    }

    const [editStates, setEditStates] = useState<{ [key: string]: boolean }>({});
    
    // Function to toggle the editing state for a specific reservation
    const toggleEditState = (rid:string) => {
        // Switch to edit restaurant page
        router.push(`/editrestaurant/${rid}`);
    };


    //waiting for fetched data
    if(!allRestaurant){return <p>Loading ... <LinearProgress/></p>}


    return (
        <div className=''>
            <div className='flex flex-col xl:py-5 xl:flex-row mt-4 gap-5 items-center justify-around'>
                
                <Profile profile={profile} />

                {
                    ownedRestaurant.length > 0 
                    ?   <div className='flex flex-col gap-y-4 w-full md:w-[720px] bg-slate-200 p-2 items-center sm:mx-4 rounded-sm'>
                            {ownedRestaurant.map((item: any) => (
                                    <div key={item._id} className='bg-slate-50 shadow-md w-full md:w-[700px] h-[200px] rounded-md'>
                                        <div className='h-full w-full flex flex-row items-center justify-center px-5'>
                                            <Image
                                                src={item.image??'img/placeholder.svg'}
                                                alt="Image"
                                                width={150}
                                                height={100}
                                                className="size-14 self-start sm:self-center mt-12 rounded-full sm:mt-0 sm:rounded-none sm:w-[150px] sm:h-auto"
                                            />
                                            <div className='w-full flex flex-col gap-2 pl-3 pb-3 relative'>
                                                {!editStates[item._id] && (
                                                    <button className='ml-auto w-fit h-fit py-0 absolute right-0' onClick={(e) => {toggleEditState(item.id);}}>
                                                        <Edit fontSize='medium' sx={{ color: "black" }} />
                                                    </button>
                                                )}

                                                {/* ------------------Below this are informations------------------ */}

                                                <Link href={`Restaurant/${item.id}`}>
                                                    <div className='text-left text-lg font-semibold text-teal-700 underline hover:text-teal-900'>
                                                        {item.name}
                                                    </div>
                                                </Link>

                                                <div className='text-left text-sm font-medium text-gray-600'>
                                                    Reservation Count: {item.reservations.length}
                                                </div>
                                                <div className='text-left text-sm font-medium text-gray-600'>
                                                    Reservation Rating: {item.averageRating} ★
                                                </div>

                                                <div className='ml-auto flex flex-row gap-2'>
                                                        <button className="rounded-md bg-orange-600 hover:bg-orange-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>{router.push(`/restaurantreserve/${item._id}`)}}>
                                                            Reservations
                                                        </button>
                                                        <button className="block rounded-md bg-red-600 hover:bg-red-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>removeRestaurant(item._id)}
                                                        >
                                                           Delete
                                                        </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className='m-2'>
                                <Link href={'/addRestaurant'} className='w-fit text-xl font-medium bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md text-white'>
                                    <AddCircleIcon /> Add restaurant
                                </Link>
                            </div>
                        </div>
                    :   <div className="w-[95%] md:max-w-[700px] h-72 flex flex-col flex-nowrap items-center justify-center gap-y-3 bg-slate-200 mx-5 ">
                            <div className='text-lg text-slate-600'>You have no restaurant</div>
                            <Link href={'/addRestaurant'} className='w-fit text-xl font-medium bg-purple-500 hover:bg-purple-600 p-2 rounded-md text-white'>
                                Make some restaurant !
                            </Link>
                        </div>
                }
            </div>
        </div>
    );
}
