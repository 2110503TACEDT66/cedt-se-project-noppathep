export default async function getTable(id:string){

    const response = await fetch(`http://localhost:5000/api/v1/table/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch Table")
    }
    return await response.json()
}