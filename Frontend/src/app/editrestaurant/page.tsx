
export default function editRestaurant() {
    return (
       <div className="flex flex-col xl:py-5 xl:flex-row mt-4 gap-5 items-center justify-around">
            <div className="w-full  md:max-w-[700px] h-full xl:self-start xl:ml-5 p-2 border-2 border-gray-100 text-black shadow-lg" >
                <div className="relative text-2xl font-semibold text-start sm:text-center p-2">
                    Edit Restaurant
                </div>
                <table className='w-full'>
                            <tbody className='[&>tr>th]:text-start [&>tr>th]:px-4 [&>tr>th]:w-44 sm:[&>tr>th]:w-52 sm:[&>tr>td]:w-96 [&>tr]:h-11'>
                               
                                <tr>
                                    <th>Address:</th>
                                </tr>
                                <tr>
                                    <th>Province:</th>
                                </tr>
                                <tr>
                                    <th>Region:</th>
                                </tr>
                                <tr>
                                    <th>Tel:</th>
                                </tr>
                                <tr>
                                    <th>Opening-hours:</th>
                                </tr>

                            </tbody>
                        </table>
                        <button className="block rounded-md bg-green-600 hover:bg-green-700 px-5 py-1 mt-5 ml-4 text-white shadow-sm justify-center" >
                                Confirm Edit
                        </button>
            </div>
       </div>
    
    );
}