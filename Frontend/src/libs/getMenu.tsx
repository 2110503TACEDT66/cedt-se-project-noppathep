

export default async function getMenu(id:string){
    const response = await fetch(`https://presentation-day-1-f.vercel.app/api/v1/menus/${id}`)
    if(!response.ok){
        throw new Error("Failed to fetch Restaurant")
    }
    return await response.json()
}