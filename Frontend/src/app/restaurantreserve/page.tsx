import ManageList from "@/components/ManageList";
export default function restaurantReserve({params}:{params:string}) {
    
    return(
        <div>
            <div className=" md-10 p-10 text-black shadow-sm relative text-2xl font-semibold text-start sm:text-center p-2">
                Restaurant's Reservation
                <div className='text-left text-sm font-medium text-gray-600 p-10'>
                    Reservation Count: 0
                </div>
            </div>
           
            <div className='flex flex-col gap-y-4 w-full md:w-[720px] bg-slate-200 p-2 items-center sm:mx-4 rounded-sm relative text-2xl'>
                <div className='h-full w-full flex flex-row items-center justify-center px-5 bg-slate-50 text-black'>
                    List 1    
                </div>
                <div className='h-full w-full flex flex-row items-center justify-center px-5 bg-slate-50 text-black'>
                    List 2   
                </div>
                <div className='h-full w-full flex flex-row items-center justify-center px-5 bg-slate-50 text-black'>
                    List 3   
                </div>
            </div>
        </div>
       
    );

}