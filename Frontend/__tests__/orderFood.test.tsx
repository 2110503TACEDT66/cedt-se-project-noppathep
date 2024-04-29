import '@testing-library/jest-dom'
import userLogIn from '@/libs/user/userLogIn';
import getUserProfile from '@/libs/user/getUserProfile';
import Foodorder from '@/app/(orderingfood)/Orderfood/[rid]/page';
import getReservation from '../__mocks__/getReservation';
import { render, screen, fireEvent } from '@testing-library/react';
import NextAuthProvider from '@/app/providers/NextAuthProvider';

jest.mock('../__mocks__/getRestaurant');
jest.mock('../__mocks__/getReservation');
jest.mock('../__mocks__/getMenu');
jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));
describe('payment', () => {
    let loginResult:any;
    let profile:any;

    it('user is logged in', async () => {
        const validCredentials = {
            email: 'foodOrderTest@gmail.com',
            password: '12345678',
        };
        
        loginResult = await userLogIn(validCredentials.email, validCredentials.password);
        
        expect(loginResult.token).toBeDefined();
        expect(loginResult.role).toBe("user")
        
        profile = await getUserProfile(loginResult.token);
        
        expect(profile.data.email).toBe("foodOrderTest@gmail.com")
        expect(profile.data.role).toBe("user")
        console.log(loginResult);
        
    })
    it('total payment', async () => {
        const mockReservation = await getReservation();
        const reservation = mockReservation.data.find((res: { _id: string; }) => res._id === "reservation1");
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name:loginResult.name, email: 'foodOrderTest@gmail.com', token:loginResult.token, role:loginResult.role },
        }; 
        render(
            <NextAuthProvider session={session}>
                <Foodorder params={reservation}></Foodorder>
            </NextAuthProvider>
            
        );
        console.log(loginResult.name)
        //expect(screen.getByText('Total Price : 1050')).toBeInTheDocument();
    })

    
})