'use client'
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Button, Input } from '@mui/material';

import Swal from 'sweetalert2'

import getRestaurants from '@/libs/restaurant/getRestaurants';
import { useRouter } from 'next/navigation';
import { Close, Edit } from '@mui/icons-material';
import Link from 'next/link';
import updateUserProfile from '@/libs/user/updateUserProfile';
import deleteRestaurant from '@/libs/restaurant/deleteRestaurant';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
                await deleteRestaurant(session?.user.token || "", rid);
                Swal.fire("Restaurant Deleted!", "", "success");
                window.location.reload();
            } else return;
          });

        
    }
    //=======================================================

    const [editStates, setEditStates] = useState<{ [key: string]: boolean }>({});
    
    // Function to toggle the editing state for a specific reservation
    const toggleEditState = (rid:string) => {
        // Switch to edit restaurant page
        router.push(`/editrestaurant/${rid}`);
    };


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
    if(!allRestaurant){return <p>Loading ... <LinearProgress/></p>}


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
                    ownedRestaurant.length > 0 
                    ?   <div className='flex flex-col gap-y-4 w-full md:w-[720px] bg-slate-200 p-2 items-center sm:mx-4 rounded-sm'>
                            {ownedRestaurant.map((item: any) => (
                                    <div key={item._id} className='bg-slate-50 shadow-md w-full md:w-[700px] h-[200px] rounded-md'>
                                        <div className='h-full w-full flex flex-row items-center justify-center px-5'>
                                            <Image
                                                src="/img/thaispice.jpg"
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
                                                    {/* ADD RATING */}
                                                    Reservation Rating: 
                                                </div>

                                                <div className='ml-auto flex flex-row gap-2'>
                                                        <button className="rounded-md bg-orange-600 hover:bg-orange-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>{router.push(`/restaurantreserve/${item._id}`)}}>
                                                            View Reservations
                                                        </button>
                                                        <button className="block rounded-md bg-red-600 hover:bg-red-700 px-2 py-1 text-white shadow-sm" 
                                                                onClick={()=>removeRestaurant(item._id)}
                                                        >
                                                           Delete Restaurant
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
