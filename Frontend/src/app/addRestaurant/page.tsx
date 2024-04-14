export default  async function addResPage() {
    
    return (
        <main className="bg-slate-100 p-5 flex flex-col items-center sm:w-2/3 ml-auto mr-auto">
            <form className="flex flex-col gap-3 items-center justify-center w-full">
                <div className="text-xl text-blue-700">Add your Restaurant</div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="name">
                        Name
                    </label>
                    <input type="text"  required id="name" name="name" placeholder="Restaurant Name"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center  
                    text-gray-700  focus:outline-none focus:border-blue-400"/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="address">
                        Address
                    </label>
                    <input type="text"  required id="address" name="address" placeholder="Restaurant Address"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400"/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="tel">
                        Telephone
                    </label>
                    <input type="tel" required id="tel" name="tel" placeholder="Telephone Number"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400"/>
                </div>
                <div className="flex flex-row flex-wrap items-center w-full justify-between gap-3">
                    <span className="w-full flex flex-row justify-between">
                        <label className="w-auto block text-gray-700" htmlFor="open">
                            Open-Time
                        </label>
                        <input type="text"  required id="open" name="open" placeholder="00:00"
                        className="bg-white border-2 border-gray-200 rounded w-1/2 p-2
                        text-gray-700  focus:outline-none focus:border-blue-400"/>
                    </span>
                    <span className="w-full flex flex-row justify-between">
                        <label className="w-auto block text-gray-700" htmlFor="close">
                            Close-Time
                        </label>
                        <input type="text"  required id="close" name="close" placeholder="00:00"
                        className="bg-white border-2 border-gray-200 rounded w-1/2 p-2
                        text-gray-700  focus:outline-none focus:border-blue-400"/>
                    </span>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white p-2 px-6 rounded">
                    Add New Restaurant
                </button>
            </form> 
        </main>
    );
}