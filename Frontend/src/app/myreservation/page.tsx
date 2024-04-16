
import BookingList from '@/components/MyReservation';
import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/user/getUserProfile';


export default async function mybooking() {
    const session = await getServerSession(authOptions);
    let profile = null;

    if (session) {
        profile = await getUserProfile(session.user.token);
        if (profile == "owner") return <p className='text-black text-xl text-center'>Unauthorized ... <LinearProgress /></p>;
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center' >Loading ... <LinearProgress /></p>}>
                <BookingList profile={profile}></BookingList>
            </Suspense>
        </main>
    );
}