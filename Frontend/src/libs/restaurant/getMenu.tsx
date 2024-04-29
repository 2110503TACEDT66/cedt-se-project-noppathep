

export default async function getMenu(id:string){
    const response = await fetch(`http://localhost:5000/api/v1/menus/${id}`)
    if(!response.ok){
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
        throw new Error("Failed to fetch Restaurant")
    }
    return await response.json()
}