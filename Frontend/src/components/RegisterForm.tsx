'use client'
import { useState } from "react";
import userRegister from "@/libs/user/userRegister";
import { useRouter } from 'next/navigation'

export default function RegisterForm(reRoute:any) {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [telephone, setTelephone] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = (event:any) => {
        event.preventDefault();
        const res = userRegister(email,password,telephone,name);
        if(res != null) {
        //put router
           alert("Please go login");
        }
        
    };

    
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl mb-6 text-center text-black">Registration Form</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-gray-700">Name:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="telephone" className="block text-gray-700">Telephone:</label>
                        <input 
                            type="tel" 
                            id="telephone" 
                            name="telephone" 
                            required
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-500" 
                        />
                    </div>
                    <button type="submit" 
                    className="w-full bg-white text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none border border-gray-500"
                    >
                    Register
                    </button>
                </form>
            </div>
        </div>
    );
}