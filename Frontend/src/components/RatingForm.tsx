"use client"
import rate from '@/libs/rate';
import unrate from '@/libs/unrate';
import { LinearProgress, Rating } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RatingForm({rid, rated, rating, comment}:{rid: string, rated?: boolean, rating?: number, comment?: string}) {
    const router = useRouter()
    const [ loading, setLoading ] = useState(false);
    const [ rating_, setRating ] = useState<number>(rating ?? 0);
    const [ comment_, setComment ] = useState<string>(comment ?? "");
    const [ isRated, setIsRated ] = useState(rated??false);
    const { data: session } = useSession();
    

    async function rate_ (rating: number, comment: string) {
        setLoading(true)
        if (session !== null) {
            try{
                await rate(
                    rid,
                    (session.user as any).token,
                    rating,
                    comment,
                )
                router.back()
            } catch {}
        }
        setLoading(false)
    }

    async function unrate_ () {
        setLoading(true)
        if (session !== null) {
            try{
                await unrate(
                    rid,
                    (session.user as any).token,
                )
                router.back()
            }catch {}
        }
        setLoading(false)
    }

    return (
        loading ? <p>Loading ... <LinearProgress/></p>:
        <main className="flex flex-col items-center">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 space-y-4 mt-4 sm:w-1/3 flex flex-col justify-center items-center">
                <label className="block text-sm font-medium text-gray-700">
                Please rate the restaurant.
                </label>
                <Rating defaultValue={rating_} size='large' onChange={(e,v)=>{setRating(v??0)}}/>
                <label className="block text-sm font-medium text-gray-700">
                Leave a comment.
                </label>
                <textarea className="h-40 w-full bg-gray-100 text-gray-700 rounded-md resize-none p-3" maxLength={100} defaultValue={comment_} onChange={(e)=>{setComment(e.target.value)}}/>    
                {
                    !isRated ? <button onClick={async (e)=>{await rate_(rating_, comment_)}} className="block rounded-md bg-emerald-500 hover:bg-emerald-400 px-3 py-2 
                    text-white shadow-sm w-full">
                        Rate
                    </button> : 
                    <>
                        <div className='flex flex-row gap-2'>
                            <button onClick={async (e)=>{await rate_(rating_, comment_)}} className="rounded-md bg-emerald-500 hover:bg-emerald-400 px-3 py-2 
                            text-white shadow-sm">
                                Update
                            </button>
                            <button onClick={async (e)=>{await unrate_()}} className="rounded-md bg-orange-600 hover:bg-orange-700 px-3 py-2 
                            text-white shadow-sm">
                                Delete
                            </button>
                        </div>
                    </>
                }
            </form>
        </main>
    );
}