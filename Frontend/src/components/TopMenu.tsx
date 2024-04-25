import styles from './topmenu.module.css'
import Image from 'next/image'
import TopMenuItem from './TopMenuItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Link } from '@mui/material'
import getUserProfile from '@/libs/user/getUserProfile'
import { Hidden } from '@mui/material'
import DrawerPanel from './DrawerPanel'

import { Login, Logout } from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default async function TopMenu(){

    const session = await getServerSession(authOptions);
    let profile = null;

    if (session != null)
        profile = await getUserProfile(session?.user.token);


    return(
        <div className={styles.menucontainer}>
            <Hidden smUp>
                <DrawerPanel>
                    {
                        session
                            ?   <Link href={"/api/auth/signout"} className="w-full h-fit p-1 pl-3 pr-3 mt-auto mb-auto text-center text-gray-100
                                    text-2xl hover:bg-slate-800" underline="none">
                                    <div className="text-red-600  overflow-hidden"> <Logout fontSize="medium"/> &nbsp;Sign-Out 
                                        <br/><span className="text-gray-400 text-base text-ellipsis">({session.user.name})</span>
                                    </div>
                                </Link>
                            :   <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
                                    <Link href={"/api/auth/signin"} className="w-full h-fit p-2 pl-3 pr-3 mt-auto mb-auto text-center text-gray-100
                                    text-2xl hover:bg-slate-800 " underline="none">
                                        <div className="text-gray-100 line-clamp-1"> <Login fontSize="medium" /> &nbsp;Sign-In</div>
                                    </Link>
                                    <Link href={"/api/auth/register"} className="w-full h-fit p-2 pl-3 pr-3 mt-auto mb-auto text-center text-gray-100
                                    text-2xl hover:bg-slate-800 " underline="none">
                                        <div className="text-gray-100 line-clamp-1"> <AssignmentIndIcon fontSize="medium" /> &nbsp;Register</div>
                                    </Link>
                                </div>
                    }
                    {
                        session && (
                            <div className='flex flex-col justify-center items-center w-full gap-3'>
                                {
                                    profile.data.role == "user" && (
                                        <Link href="/myreservation" underline="none" className="w-full text-center p-2 pl-3 pr-3 text-2xl hover:bg-slate-800 text-gray-100">
                                            <div className="text-gray-100 line-clamp-1"><RestaurantIcon fontSize="medium" /> &nbsp;&nbsp;My Reservation</div>
                                        </Link>
                                    )
                                }
                                {
                                    profile.data.role === "owner" && (
                                        <Link href="/myrestaurant" underline="none" className="w-full text-center p-2 pl-3 pr-3 text-2xl hover:bg-slate-800 text-gray-100">
                                            <div className="text-gray-100 line-clamp-1"><StorefrontIcon fontSize="medium" /> &nbsp;&nbsp;My Restaurant</div>
                                        </Link>
                                    )
                                }
                                {
                                    profile.data.role === "admin" && (
                                        <Link href="/manage" underline="none" className="w-full text-center p-2 pl-3 pr-3 text-2xl hover:bg-slate-800 text-gray-100">
                                            <div className="text-gray-100 line-clamp-1"><SettingsIcon fontSize="medium" /> &nbsp;&nbsp;Manage</div>
                                        </Link>
                                    )
                                }

                                <Link href="/reservation" underline="none" className="w-full text-center p-2 pl-3 pr-3 text-2xl hover:bg-slate-800 text-gray-100">
                                    <div className="text-gray-100 line-clamp-1"><RestaurantMenuIcon fontSize="medium" /> &nbsp;&nbsp;Reservation</div>
                                </Link>
                            </div>
                        )
                    }
                </DrawerPanel>
            </Hidden>
            
            <Hidden smDown>

                {
                    session ? 
                    <Link href="/api/auth/signout">
                        <div className='flex items-center h-full px-2 text-cyan-600 text-sm truncate '>Sign-out of {session.user?.name}</div>
                    </Link> 
                    : 
                    <Link href="/api/auth/signin">
                        <div className='flex items-center h-full px-2 text-cyan-600 text-sm'>Sign-in</div>
                    </Link>
                }
                {
                    session?
                    <div className='flex items-center h-full px-2 text-cyan-600 text-sm'>
                        {
                            profile.data.role == "user" && (
                                <TopMenuItem title='My Reservation' pageRef='/myreservation'/>
                            )
                        }
                        {
                            profile.data.role === "owner" && (
                                <TopMenuItem title='My Restaurant' pageRef='/myrestaurant'/>
                            )
                        }
                        {
                            profile.data.role === "admin" && (
                                <TopMenuItem title='Manage' pageRef='/manage'/>
                            )
                        }
                    </div>
                    :
                    <Link href="/api/auth/register">
                        <div className='flex items-center h-full px-2 text-cyan-600 text-sm'>Register</div>
                    </Link>
                }
                
                <TopMenuItem title='Reservation' pageRef='/reservation'/>
            </Hidden>

            <Link href="/" className='ml-4'>
                <Image src='/img/logo.jpg' className={styles.logoimg} alt='logo' width={0} height={0} sizes='100vh'/>
            </Link>
        </div>
    )
}
