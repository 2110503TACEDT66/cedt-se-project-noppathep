
export default async function getUserProfile(token:string){

    const response = await fetch("http://localhost:5000/api/v1/auth/me",{
        method:"GET",
        headers:{
            authorization:`Bearer ${token}`
        }
    })
    if(!response.ok){
        setTimeout(() => {
            window.location.href = "/error"
          }, 2000);
        throw new Error("Cannot get User Profile")
    }
    return await response.json()
}