import '@testing-library/jest-dom';
import userLogIn from '@/libs/user/userLogIn';
import getReservation from '@/libs/reservation/getReservation';

describe('Test user made reservation', () => {
    let loginResult:any;
     
    beforeEach(async() => {
        const validCredentials = {
            email: 'foodOrderTest@gmail.com',
            password: '12345678',
        };
        
        loginResult = await userLogIn(validCredentials.email, validCredentials.password); 
    })

    it('payment Test', async() => {
        const response = await getReservation("token",loginResult.token);
        expect(response.totalPrice).toBe(1050);
    })
})