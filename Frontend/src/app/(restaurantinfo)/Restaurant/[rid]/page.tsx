import getRestaurant from '@/libs/restaurant/getRestaurant';
import getMenu from '@/libs/restaurant/getMenu';
import Image from 'next/image';
import CommentRatingCatalog from '@/components/CommentRatingCatalog';
import getRatingByRestaurant from '@/libs/restaurant/getRatingByRestaurant';
import Rating from '@mui/material/Rating';
import Link from 'next/link';

export default async function RestaurantPage({params}:{params:{rid:string}}){

    const RestaurantDetail = await getRestaurant(params.rid)
    const MenuResponse = await getMenu(params.rid)
    if(!MenuResponse) return (<p>Menu is Loading</p>)
        
    // console.log(RestaurantDetail)
    const comments = await getRatingByRestaurant(params.rid);
    // console.log(comments.count)
    if(!comments) return (<p>Comment is Loading</p>)

    return(
        <main className="text-center p-5 text-black">
            <h1 className="text-lg font-medium">{RestaurantDetail.data.name}</h1>
            
            <div className="flex flex-row my-5 gap-3 flex-wrap">
                <Image src={RestaurantDetail.data.image??'/img/placeholder.svg'} 
                alt='restaurant logo' width={0} height={0} sizes="100vw"
                className='rounded-lg w-full sm:w-[20%]'
                />
                <table className='table-auto border-separate border-spacing-2 bg-gray-100 w-full sm:w-fit rounded-lg p-2 text-left'>
                    <tbody>
                        <tr>
                            <td>Address:</td>
                            <td>{RestaurantDetail.data.address.district}</td>
                        </tr>
                        <tr>
                            <td>Province:</td>
                            <td>{RestaurantDetail.data.address.province}</td>
                        </tr>
                        <tr>
                            <td>Region:</td>
                        <td>{RestaurantDetail.data.address.region}</td>
                        </tr>
                        <tr>
                            <td>Tel.</td>
                            <td>{RestaurantDetail.data.tel}</td>
                        </tr>
                        <tr>
                            <td>Rating:</td>
                            <td>{RestaurantDetail.data.averageRating} <Rating size='small' value={RestaurantDetail.data.averageRating} readOnly/></td>
                        </tr>
                        <tr>
                            <td>Opening hours:</td>
                            <td>{RestaurantDetail.data.openingHours.open} - {RestaurantDetail.data.openingHours.close}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} align='right'>
                            <Link href={`/restaurantreserve/${params.rid}`}>
                                <button className='p-1 px-2 text-gray-100 bg-emerald-700 font-semibold w-fit h-fit rounded-md hover:bg-emerald-800'>
                                    Manage reservations
                                </button>
                            </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
            <div className="grid grid-cols-3 gap-4">
                {MenuResponse.data.map((RestaurantItem:any, index:number)=>(
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="aspect-w-16 aspect-h-9 mb-4 content-center flex justify-center">
                        <Image src={RestaurantItem.image} alt="Product Picture" width={300} height={300} className="object-cover rounded-lg"/>
                    </div>
                    <div className="text-center">
                    <h3 className="text-lg font-semibold">{RestaurantItem.name} : {RestaurantItem.price} ฿</h3>
                    </div>
                    </div>
                ))}
            </div>
            <CommentRatingCatalog ratingJson={comments}/>
        </main>
    )
}