import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';
import AddCard from '@/components/CreditCard/AddCard';


export default async function credit() {
    const session = await getServerSession(authOptions);
    let profile = null;
    if (session) {
        profile = await getUserProfile(session.user.token);
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <AddCard/>
        </main>
    );
}