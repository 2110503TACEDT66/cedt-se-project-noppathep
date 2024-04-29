import '@testing-library/jest-dom'
import userLogIn from '@/libs/user/userLogIn';
import getUserProfile from '@/libs/user/getUserProfile';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationForm from '@/components/ReservationForm';
import NextAuthProvider from '@/app/providers/NextAuthProvider';
import { waitFor } from '@testing-library/react';
import getRestaurants from '../__mock__/getRestaurant';

jest.mock('../__mock__/getRestaurant');

describe('Test user made reservation', () => {
    let loginResult:any;
    let profile:any;

    
    it('user is logged in', async () => {
        const validCredentials = {
            email: 'k19@gmail.com',
            password: '123456',
        };
        
        loginResult = await userLogIn(validCredentials.email, validCredentials.password);
        
        expect(loginResult.token).toBeDefined();
        expect(loginResult.role).toBe("user")
        
        profile = await getUserProfile(loginResult.token);
        
        expect(profile.data.email).toBe("k19@gmail.com")
        expect(profile.data.role).toBe("user")
        
    })

    it('made reservation at restaurant within their opening period', async () => {
        const session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { name: 'K19', email: 'k19@gmail.com', token: loginResult.token, role: loginResult.role },
        };

        render(
            <NextAuthProvider session={session}>
                <ReservationForm profile={profile}/>
            </NextAuthProvider>
        );

        // await waitFor(() => {
        //     expect(screen.getByText('Choose the restaurant')).toBeInTheDocument();

        //     expect(screen.getByPlaceholderText("Pick a restaurant")).toBeInTheDocument();

        //     fireEvent.mouseDown(screen.getByPlaceholderText("Pick a restaurant"));
        // });
    })

    it('made reservation at restaurant outside their opening period', () => {

    })
})
