'use client'
import  React from 'react';

export default function InteractiveCard({children}:{children:React.ReactNode}){

    function MouseonCard(event:React.SyntheticEvent){
        if(event.type=='mouseover'){
            event.currentTarget.classList.remove('bg-white')
            event.currentTarget.classList.remove('shadow-lg')
            event.currentTarget.classList.add('shadow-2xl')
            event.currentTarget.classList.add('bg-neutral-200')
        }else{
            event.currentTarget.classList.remove('bg-neutral-200')
            event.currentTarget.classList.remove('shadow-2xl')
            event.currentTarget.classList.add('shadow-lg')
            event.currentTarget.classList.add('bg-white')
        }
    }
    return(
        <div className='rounded-lg shadow-lg bg-white w-4/5 h-[300px] flex-auto'onMouseOver={(e)=>MouseonCard(e)}onMouseOut={(e)=>MouseonCard(e)}>
            {children}
        </div>
    )
} 