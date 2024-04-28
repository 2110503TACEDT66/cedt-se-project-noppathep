"use client"
import { useEffect, useState } from "react";
import { RestaurantModel } from "../../../../../interface";
import getUserProfile from "@/libs/user/getUserProfile";
import { getSession } from "next-auth/react";
import { TimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs";
import updateRestaurant from "@/libs/restaurant/updateRestaurant";
import getRestaurant from "@/libs/restaurant/getRestaurant";


export default function editRestaurant({params}:{params:{rid:string}}) {

    const [restaurantName, setRestaurantName] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [province, setProvince] = useState<string>("");
    const [postalcode, setPostalcode] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const [open, setOpen] = useState<Dayjs>(dayjs());
    const [close, setClose] = useState<Dayjs>(dayjs());
    const [tel, setTel] = useState<string>("");

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const bufferRestaurantData = await getRestaurant(params.rid);
                setRestaurantName(bufferRestaurantData.data.name);
                setDistrict(bufferRestaurantData.data.address.district);
                setProvince(bufferRestaurantData.data.address.province);
                setPostalcode(bufferRestaurantData.data.address.postalcode);
                setRegion(bufferRestaurantData.data.address.region);
                setOpen(dayjs(bufferRestaurantData.data.openingHours.open, 'HH:mm'));
                setClose(dayjs(bufferRestaurantData.data.openingHours.close, 'HH:mm'));
                setTel(bufferRestaurantData.data.tel);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };
        fetchRestaurantData();
    }, [params.rid]);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const session = await getSession();

        if (session != null) {
            const userData = await getUserProfile(session?.user.token);
            const owner = userData.data._id;
            
            const updatedRestaurant:RestaurantModel = {
                _id: "",
                name: restaurantName,
                owner: owner,
                address: {
                    district: district,
                    province: province,
                    postalcode: postalcode,
                    region: region,
                },
                averageRating: 0,
                openingHours: {
                    open: open.format("HH:mm"),
                    close: close.format("HH:mm"),
                },
                tel: tel,
                image: "",
            }
            try {
                console.log(updatedRestaurant);
                await updateRestaurant(params.rid ,session.user.token, updatedRestaurant);
                console.log("Successfully update restaurant");
                window.location.href = '/myrestaurant';
            } catch (error) {
                console.log(updatedRestaurant);
                console.error("Failed to update restaurant:", error);
            }
        }
    }

    return (
        <main className="bg-slate-100 p-5 flex flex-col items-center sm:w-2/3 ml-auto mr-auto">
            <form className="flex flex-col gap-3 items-center justify-center w-full" onSubmit={handleSubmit}>
                <div className="text-xl text-blue-700">Edit your Restaurant</div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="name">
                        Name
                    </label>
                    <input type="text"  required id="name" name="name" placeholder="Restaurant Name"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center  
                    text-gray-700  focus:outline-none focus:border-blue-400" onChange={(e) => setRestaurantName(e.target.value)}
                    value={restaurantName}/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="district">
                        District
                    </label>
                    <input type="text"  required id="district" name="district" placeholder="Restaurant District"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400" onChange={(e) => setDistrict(e.target.value)}
                    value={district}/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="province">
                        Province
                    </label>
                    <input type="text"  required id="province" name="province" placeholder="Restaurant Province"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400" onChange={(e) => setProvince(e.target.value)}
                    value={province}/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="postalcode">
                        Postalcode
                    </label>
                    <input type="text"  required id="postalcode" name="postalcode" placeholder="Restaurant Postalcode"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400" maxLength={5} onChange={(e) => setPostalcode(e.target.value)}
                    value={postalcode}/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="region">
                        Region
                    </label>
                    <input type="text"  required id="region" name="region" placeholder="Restaurant Region"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400" onChange={(e) => setRegion(e.target.value)}
                    value={region}/>
                </div>
                <div className="flex items-center w-full justify-between">
                    <label className="w-auto block text-gray-700" htmlFor="tel">
                        Telephone
                    </label>
                    <input type="tel" required id="tel" name="tel" placeholder="Telephone Number"
                    className="bg-white border-2 border-gray-200 rounded w-1/2 p-2 justify-center
                    text-gray-700  focus:outline-none focus:border-blue-400" minLength={10} maxLength={10} onChange={(e) => setTel(e.target.value)}
                    value={tel}/>
                </div>
                <div className="flex flex-row flex-wrap items-center w-full justify-center gap-3">
                    <span className="w-full flex flex-row justify-center gap-8">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                            label="Open"
                            value={dayjs(open)}
                            format="HH:mm"
                            onChange={(e) => setOpen(dayjs(e))}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                            label="Close"
                            value={dayjs(close)}
                            format="HH:mm"
                            onChange={(e) => setClose(dayjs(e))}
                            />
                        </LocalizationProvider>
                    </span>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white p-2 px-6 rounded">
                    Edit Restaurant
                </button>
            </form> 
        </main>
    );
}