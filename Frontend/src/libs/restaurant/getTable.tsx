export default async function getTable(id:string, token: string){
    if (!token) {
        throw new Error("Authorization token is required");
    }
    const requestOptions = {
        method: 'GET', // HTTP method
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await fetch(`http://localhost:5000/api/v1/restaurants/${id}/tables`, requestOptions)
    if(!response.ok){
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
        throw new Error("Failed to fetch Restaurant")
    }
    return await response.json()
}