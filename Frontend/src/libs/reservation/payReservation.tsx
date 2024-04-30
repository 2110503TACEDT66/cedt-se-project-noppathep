export default async function payReservation(rid:string,token:string){

    const response = await fetch(`http://localhost:5000/api/v1/reservations/${rid}/paid`,{
        method:'PUT',
        headers:{
            authorization:`Bearer ${token}`
        }
    });
    if(!response.ok){
        const errorMessage = await response.text();
        try {
            const errorJson = JSON.parse(errorMessage);
            if (errorJson.message) {
                throw new Error(errorJson.message);
            } else {
                throw new Error("Unknown error occurred");
            }
        } catch (error:any) {
            console.error("Error parsing error message:", error);
            throw new Error(error.message);
        }
    }
    return await response.json();
}