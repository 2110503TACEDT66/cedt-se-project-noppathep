"use client"
import { Button } from "@mui/material"
import { useSearchParams } from "next/navigation"

export default function Page(){
    
    const params = useSearchParams();
    const errMsg = params.get("error")
    
    return(
        <div className="mx-auto mt-7 flex flex-col justify-center gap-y-3 bg-slate-200 p-5 min-w-[400px] w-[50%] max-w-[500px] rounded-lg">
            <div className="text-red-700 text-xl text-center w-fit h-fit">{errMsg}</div>        
            <Button href="/api/auth/signin" variant="contained" color="primary" className="w-[80%] self-center mt-4 bg-blue-500 text-xl font-kanit">BACK TO LOGIN</Button>
        </div>


    )
}