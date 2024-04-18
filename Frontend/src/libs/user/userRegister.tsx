export default async function userRegister(userEmail:string,userPassword:string,telephoneNum:string,userName:string, userRole:string){

    const response = await fetch("http://localhost:5000/api/v1/auth/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name:userName,
            email:userEmail,
            password:userPassword,
            telephone:telephoneNum,    
            role:userRole // could be "user" or "owner" (restaurant owner)
        })
    })
    if(!response.ok){
        alert("Register failed")
        return null
    }
    return await response.json()
    
}