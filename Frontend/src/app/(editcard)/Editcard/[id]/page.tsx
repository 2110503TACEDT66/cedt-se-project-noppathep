import CardPanel from '@/components/CardPanel'
import EditCard from '@/components/CreditCard/EditCard'
import RestaurantCatalog from '@/components/RestaurantCatalog'
import getRestaurants from '@/libs/getRestaurants'
import { LinearProgress } from '@mui/material'
import { Suspense } from 'react'
import getUserProfile from '@/libs/getUserProfile';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next';

export default async function Edit(){
    const session = await getServerSession(authOptions);
    let profile = null;
    if (session) {
        profile = await getUserProfile(session.user.token);
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return(
        <main>
                <EditCard/>
        </main>
    )
}