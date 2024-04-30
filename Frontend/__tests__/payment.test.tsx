import '@testing-library/jest-dom';
import getReservation from '@/libs/reservation/getReservation';
import orderFood from '@/libs/orderFood';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Payment Test', () => {

  beforeEach(() => {
    fetchMock.resetMocks();
  });

it('should return total payment', async() => {
  fetchMock.mockResponseOnce(
    JSON.stringify({ 
      success: true,
      totalPrice: 100 }),
    { status: 200 }
  );
  const result = await getReservation('reservation-id', 'auth-token');
  expect(result.success).toBe(true);
  expect(result.totalPrice).toBe(100);

})

})

describe('orderFood function', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })) as unknown as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const mockId = 'reservationId';
  const mockToken = 'token';
  const mockFood = 'foodId';

  it('should send a POST request with correct data', async () => {
    await orderFood(mockId, mockToken, mockFood);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5000/api/v1/reservations/${mockId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: mockFood,
        }),
      }
    );
  });

  it('should return the JSON response on success', async () => {
    const response = await orderFood(mockId, mockToken, mockFood);
    expect(response).toEqual({ success: true });
  });

});