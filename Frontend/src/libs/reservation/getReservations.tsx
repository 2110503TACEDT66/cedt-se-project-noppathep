

export default async function getReservations(token:string){

    const response = await fetch("http://localhost:5000/api/v1/reservations",{
        method : "GET",
        headers:{
            authorization:`Bearer ${token}`
        }
    })
    if(!response.ok){
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
            throw new Error("Failed to fetch Reservation")
    }
    return await response.json()
}