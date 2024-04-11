

export default async function getReservations(token:string){

    const response = await fetch("https://presentation-day-1-f.vercel.app/api/v1/reservations",{
        method : "GET",
        headers:{
            authorization:`Bearer ${token}`
        }
    })
    if(!response.ok){
            throw new Error("Failed to fetch Reservation")
    }
    return await response.json()
}