export default async function getTables(id:string){

    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${id}/tables`)
    if(!response.ok){
        throw new Error("Failed to fetch Tables")
    }
    return await response.json()
}