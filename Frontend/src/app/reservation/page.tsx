
import LinearProgress from '@mui/material/LinearProgress';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import getUserProfile from '@/libs/getUserProfile';
import ReservationForm from '@/components/ReservationForm';


export default async function reservation() {
    const session = await getServerSession(authOptions);
    let profile = null;
    if (session) {
        profile = await getUserProfile(session.user.token);
    } else {
        return  <p className='text-black text-xl text-center'>Please go back and login ... <LinearProgress /></p>;
    }

    return (
        <main>
            <Suspense fallback={<p className='text-black text-xl text-center'>Loading ... <LinearProgress /></p>}>
                <ReservationForm profile={profile}></ReservationForm>
            </Suspense>
        </main>
    );
}