

export default async function getRatingByRestaurant(id:string){
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${id}/rating`)
    if(!response.ok){
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
            throw new Error("Failed to fetch Restaurant Rating")
    }
    return await response.json()
}