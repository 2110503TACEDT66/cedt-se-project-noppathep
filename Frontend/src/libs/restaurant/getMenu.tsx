

export default async function getMenu(id:string){
    const response = await fetch(`http://localhost:5000/api/v1/menus/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch Restaurant")
    }
    return await response.json()
}