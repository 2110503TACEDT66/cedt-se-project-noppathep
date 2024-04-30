//user story2-3
import updatePoint from '@/libs/user/updatePoint';
import payReservation from '@/libs/reservation/payReservation';
import fetchMock from 'jest-fetch-mock';

// Initialize fetchMock to work with Jest
fetchMock.enableMocks();

describe('Customer Scenarios', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mock state before each test
  });

  // Test case 1: Customer has credit card, at least one reservation, and gains points equal to 10% of their payment
  it('should give points equal to 10% of the reservation order total price', async () => {
    const totalOrderPrice = 100; // Example order price
    const expectedPoints = totalOrderPrice * 0.10; // 10% of order price

    // Mock successful response when updating points
    fetchMock.mockResponseOnce(JSON.stringify({ points: expectedPoints }), { status: 200 });

    const token = 'valid-token'; // Session is defined
    const points = expectedPoints;

    const response = await updatePoint(token, points);

    expect(fetchMock).toHaveBeenCalledTimes(1); // Ensure fetch was called once
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/auth/update',
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points }),
      }
    );

    expect(response.points).toEqual(expectedPoints); // Check that the points match the expected output
  });

  // Test case 2: Customer hasn't added credit card and has at least one reservation
  it('should not be able to make a payment if credit card is not added', async () => {
    const reservationId = '12345'; // Example reservation ID
    const token = 'invalid-token'; // Token represents a session without a valid credit card

    // Mocking an error response indicating the customer can't make a payment
    const errorResponse = { message: "Can't make a payment" };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 403 });

    try {
      await payReservation(reservationId, token);
    } catch (error) {
      expect(error.message).toEqual(errorResponse.message); // Expected output: can't make a payment
    }

    expect(fetchMock).toHaveBeenCalledTimes(1); // Ensure fetch was called once
    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:5000/api/v1/reservations/${reservationId}/paid`,
      {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
  });

  // Test case 3: Session isn't defined, customer hasn't added credit card, no reservation
  it("shouldn't be able to access reservation without a session", async () => {
    const endpoint = "http://localhost:5000/api/v1/reservations";
    const invalidToken = ''; // No token or empty token

    // Mock a response indicating unauthorized access due to missing or invalid token
    const unauthorizedResponse = { success: false, message: 'Not authorize to access this route' };
    fetchMock.mockResponseOnce(JSON.stringify(unauthorizedResponse), { status: 401 });

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${invalidToken}`, // Simulate missing or invalid token
        },
      });
    } catch (error) {
      expect(error.message).toEqual('Not authorize to access this route'); // Expected error for unauthorized access
    }

    expect(fetchMock).toHaveBeenCalledTimes(1); // Ensure fetch was called once
    expect(fetchMock).toHaveBeenCalledWith(
      endpoint,
      {
        method: 'GET',
        headers: {
          authorization: `Bearer ${invalidToken}`, // Missing or invalid authorization
        },
      }
    );
  });
});
