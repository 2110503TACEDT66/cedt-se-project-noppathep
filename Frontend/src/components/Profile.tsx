import updateUserProfile from '@/libs/user/updateUserProfile';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@mui/material';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Profile({profile}:{profile:any}) {
    
    const { data: session, status } = useSession();


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

    return (
        <div className="w-full  md:max-w-[700px] h-full xl:self-start xl:ml-5 p-2 border-2 border-gray-100 text-black shadow-lg" >
            {profile && (
                    <div
                         key={profile.data.id}
                    >

                        <table className='w-full'>
                            <tbody className='[&>tr>:first-child]:text-start [&>tr>:first-child]:px-4 [&>tr>:first-child]:w-44 [&>tr>:first-child]:font-semibold sm:[&>tr>:first-child]:w-52 sm:[&>tr>td]:w-96 [&>tr]:h-11'>
  
                                <tr>
                                    <td colSpan={2} className='relative text-2xl font-semibold text-start p-2'>
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
                                    </td>
                                </tr>

                                <tr>
                                    <td>Name</td>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewName(event.target.value)} placeholder={newName}/>
                                            : <>{newName}</>
                                        }
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td>Email</td>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewEmail(event.target.value)} placeholder={newEmail}/>
                                            : <>{newEmail}</>
                                        }
                                    </td>
                                </tr>

                                <tr>
                                    <td>Tel.</td>
                                    <td>
                                        {
                                        isEditProfile
                                            ? <Input className='w-full sm:w-[80%]' color='info' onChange={ event => setNewTel(event.target.value)} placeholder={newTel}/>
                                            : <>{newTel}</>
                                        }
                                    </td>
                                </tr>

                                {
                                    profile.role == "user" && (
                                        <tr>
                                            <td>Credit/Debit Card</td>
                                            <td>
                                                <Link href={'/yourcard'} className='w-fit text-m font-medium bg-purple-500 hover:bg-purple-600 p-2 rounded-md text-white'>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                }
                                {
                                    profile.role == "user" && (
                                        <tr>
                                            <th>Points</th>
                                            <td>{profile.data.points}</td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td>Member since</td>
                                    <td>{formatDate(profile.data.createdAt)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
}