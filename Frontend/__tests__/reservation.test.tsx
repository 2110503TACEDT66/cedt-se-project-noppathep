import '@testing-library/jest-dom'
import userLogIn from '@/libs/user/userLogIn';
import getUserProfile from '@/libs/user/getUserProfile';
import { render, screen, fireEvent } from '@testing-library/react';
import ReservationForm from '@/components/ReservationForm';
import NextAuthProvider from '@/app/providers/NextAuthProvider';
import { waitFor } from '@testing-library/react';

jest.mock('../__mocks__/getRestaurant');
jest.mock('../__mocks__/createdReservation');

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

        // Wait for restaurants to be loaded
        await waitFor(() => {
            expect(screen.getByLabelText('Choose the restaurant')).toBeInTheDocument();
        });

        // Find the dropdown element
        const dropdown = screen.getByRole('combobox', { name: 'Choose the restaurant' });

        // Check if the expected options are present in the dropdown
        expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
        // // Wait for restaurants to be loaded
        // await waitFor(() => {
        //   expect(screen.getByLabelText('Choose the restaurant')).toBeInTheDocument();
        // });
      
        // // Simulate user selecting a restaurant
        // fireEvent.change(screen.getByLabelText('Choose the restaurant'), { target: { value: 'restaurant1' } });
      
        // // Simulate user selecting a reservation date
        // // Here, you might need to mock the DateReserve component or its behavior
        // // You can mock the behavior of the DateReserve component similarly to how we mocked getRestaurants
      
        // // Simulate user clicking the "Reserve now" button
        // fireEvent.click(screen.getByText('Reserve now'));
      
        // // Wait for confirmation popup to appear
        // await waitFor(() => {
        //   expect(screen.getByText('Do you want to make this reservation?')).toBeInTheDocument();
        // });
      
        // // Simulate user confirming the reservation
        // fireEvent.click(screen.getByText('Sure'));
      
        // // Wait for success message to appear
        // await waitFor(() => {
        //   expect(screen.getByText('Reservation Complete!')).toBeInTheDocument();
        // });
      });

    it('made reservation at restaurant outside their opening period', () => {

    })
})
