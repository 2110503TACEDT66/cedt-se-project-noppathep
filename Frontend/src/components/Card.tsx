"use client"
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import Rating from '@mui/material/Rating';

export default function Card({ RestaurantName, imgSrc,rating }: { RestaurantName: string, imgSrc: string,rating?:number }) {
    return (
        <InteractiveCard>
            <div className='h-[300px] round-lg shadow-lg bg-white flex-auto relative' >
                <div className='width-full h-[70%] relative rounded-t-lg'>
                    <Image
                        src={imgSrc}
                        alt='Product Picture'
                        fill={true}
                        className='object-contain round-t-lg'
                    />
                </div>
                <div className='w-full h-[10%] p-[10px] text-black'>{RestaurantName}</div>
                <div className='absolute right-0 bottom-0'>
                    <Rating 
                    value={rating}
                    readOnly
                    />
                </div>
            </div>
        </InteractiveCard>
    );
}
