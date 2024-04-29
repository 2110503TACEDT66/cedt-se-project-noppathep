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
                alert(errorJson.message);
                throw new Error(errorJson.message);
            } else {
                throw new Error("Unknown error occurred");
            }
        } catch (error) {
            console.error("Error parsing error message:", error);
            setTimeout(() => {
                window.location.href = "/error"
              }, 2000);
            throw new Error("Cannot make a payment");
        }
    }
    return await response.json();
}