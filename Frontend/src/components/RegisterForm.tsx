'use client'
import { useState } from "react";
import userRegister from "@/libs/user/userRegister";
import { useRouter } from 'next/navigation'
import userLogIn from "@/libs/user/userLogIn";
import { getSession, signIn } from "next-auth/react";
import { CircularProgress } from "@mui/material";

export default function RegisterForm(reRoute:any) {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [telephone, setTelephone] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [role, setRole] = useState<string>("user")

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoad, setIsLoad] = useState(false);

    // const handleSubmit = (event:any) => {
    //     event.preventDefault();
    //     const res = userRegister(email,password,telephone,name, role);
    //     if(res != null) {
    //     //put router
    //        alert("Please go login");
    //     }
        
    // };

    const handleRegister = async (event:any) => {
        event.preventDefault();
        try {
          setIsLoad(true) // Set loading to true when registration starts
    
          // Call registration function
          const userData = await userRegister(email, password, telephone, name, role);
    
          // Handle success
          console.log('Registration successful!', userData);
    
          // Log in the user after successful registration
          const loginResponse = await userLogIn(email, password); // Manually log in the user
          if (loginResponse) {
              // Update session with new user data
              const session = await getSession();
              await signIn('credentials', {
                  email: email,
                  password: password,
                  callbackUrl: '/',
              });
          }
    
        } catch (error) {
          // Handle error
          console.error('Failed to register user', error);
          setErrorMessage('Registration failed. Please try again.');
        } finally {
          setIsLoad(false); // Set loading back to false when registration process finishes
        }
      };

    const areAllFieldsFilled = () => {
      return name && telephone && email && password;
    };

    
    return (
        <div className="flex justify-center items-center h-screen">
            {
              isLoad
                  ? <div className="absolute top-0 left-0 flex flex-col gap-y-3 justify-center items-center rounded-lg text-slate-50 w-full h-full bg-black/30 z-[9999]">
                      <CircularProgress thickness={6}/>
                      <div>registering...</div>
                    </div>
                  :''
            }
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl mb-6 text-center text-black">Registration Form</h2>
                <form className="space-y-4" onSubmit={handleRegister}>
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
                        <label htmlFor="role" className="block text-gray-700">Role:</label>
                        <select name="role" className="w-full rounded-md px-4 py-2" onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="owner">Restaurant Owner</option>
                        </select>
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
                    disabled={!areAllFieldsFilled()}>
                    Register
                    </button>
                </form>
            </div>
        </div>
    );
}