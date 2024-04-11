
export default async function getRestaurants(){

    const response = await fetch("https://presentation-day-1-f.vercel.app/api/v1/restaurants")
    if(!response.ok){
        throw new Error("Failed to fetch Restaurant")
    }
    return await response.json()
}