//user story2-3
import '@testing-library/jest-dom';
import userLogIn from '@/libs/user/userLogIn';
import getReservation from '@/libs/reservation/getReservation';
import payReservation from '@/libs/reservation/payReservation';
import getUserProfile from '@/libs/user/getUserProfile';


interface UserLoginResult {
    token: string;
    // Add other expected fields here
  }

describe('Test US2-3', () => {
    let loginResult1: UserLoginResult; // Explicit type for loginResult1
    let loginResult2: UserLoginResult; // Explicit type for loginResult2

  // Before each test, log in with different users
  beforeEach(async () => {
    // Test 1 user credentials
    const credentials1 = {
      email: 'jesttest1@gmail.com', // User 1 email
      password: '12345678',
    };

    // Test 2 user credentials
    const credentials2 = {
      email: 'jesttest2@gmail.com', // User 2 email
      password: '12345678',
    };

    // Log in with both sets of credentials
    loginResult1 = await userLogIn(credentials1.email, credentials1.password);
    loginResult2 = await userLogIn(credentials2.email, credentials2.password);
    })

  // Test case 1: Customer has credit card, at least one reservation, and gains points equal to 10% of their payment
  it('should give points equal to 10% of the reservation order total price', async () => {
    const reservationId = '66312286a47f79bccbec8b2e';
    const reservation = await getReservation(reservationId, loginResult1.token);

    if (reservation && reservation.data && reservation.data.foodOrder) {
        if (reservation && reservation.data.foodOrder) {
            let totalPrice = 0;
            const foodOrder = reservation.data.foodOrder;
            foodOrder.forEach((menuItem: { price: number; }) => {
                totalPrice += menuItem.price;
            });
        expect(reservation.totalPrice).toBe(totalPrice); // Verify total price calculation must be 100
      const expectedPoints = totalPrice * 0.10; // 10% of the order price
      const Profile = await getUserProfile(loginResult1.token); // Fetch before update profile
      await payReservation(reservationId, loginResult1.token); // Complete payment
      const updatedProfile = await getUserProfile(loginResult1.token); // Fetch updated profile
      expect(updatedProfile.data.points-Profile.data.points).toBe(expectedPoints); // Check points must be 10
      }
    }
  });
  // Test case 2: Customer hasn't added credit card and has at least one reservation
  it('should not be able to make a payment if credit card is not added', async () => {
    const userProfile = await getUserProfile(loginResult2.token);
    const reservationId = '66311bdfa47f79bccbec8701';
    const card = userProfile.data.card;

    expect(userProfile.data.card).toEqual([]); // Confirm no credit card is added
    
    const errorResponse = { message: "User doesn't have any credit card added" };
    try {
      await payReservation(reservationId, loginResult2.token);
      throw new Error('Payment should not be allowed without a credit card'); // Explicit failure
    } catch (error) {
      expect(error.message).toEqual(errorResponse.message); // Expected output: Can't make a payment
    }
  });

  // Test case 3: Session isn't defined, customer hasn't added credit card, no reservation
  it("shouldn't be able to access reservation without a session", async () => {
    // Simulate the fetch call returning a failed response
    const invalidToken = ''; // No session

    let error;
    try {
      await getUserProfile(invalidToken); // Invalid or empty token
    } catch (err) {
      error = err; // Capture the thrown error
    }

    const expectedErrorMessage = 'Cannot get User Profile';
    expect(error).toBeDefined(); // Check if an error is thrown
    expect(error.message).toEqual(expectedErrorMessage); // Verify the error message
  });
});
