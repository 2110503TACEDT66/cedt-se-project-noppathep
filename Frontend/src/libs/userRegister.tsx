export default async function userRegister(userEmail:string,userPassword:string,telephoneNum:string,userName:string){

    const response = await fetch("https://presentation-day-1-f.vercel.app/api/v1/auth/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name:userName,
            email:userEmail,
            password:userPassword,
            telephone:telephoneNum,    
            role:"user"
        })
    })
    if(!response.ok){
        alert("Register failed")
        return null
    }
    return await response.json()
    
}