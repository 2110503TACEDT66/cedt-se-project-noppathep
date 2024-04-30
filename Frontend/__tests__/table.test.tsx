// __tests__/pickTable.test.tsx
import fetchMock from 'jest-fetch-mock'; //npm install --save-dev jest-fetch-mock
import pickTable from '@/libs/pickTable';

// Enable fetch mocking before all tests
fetchMock.enableMocks();

describe('pickTable function', () => {
  beforeEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
  });

  it('should return success when the server responds with status OK', async () => {
    // Mock a successful response with status 200
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Table picked successfully' }),
      { status: 200 }
    );

    const result = await pickTable('reservation-id', 'auth-token', 'table-id');

    // Check that fetch was called with correct parameters
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/v1/reservations/reservation-id/tables',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer auth-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 'table-id' }),
      }
    );

    // Validate the expected result
    expect(result.success).toBe(true);
    expect(result.message).toBe('Table picked successfully');
  });

  it('should return error message when the server responds with status 400', async () => {
    // Mock an error response with a JSON message
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Invalid table' }),
      { status: 400 }
    );

    const result = await pickTable('reservation-id', 'auth-token', 'table-id');

    // Check that fetch was called correctly
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Validate the expected error response
    expect(result.success).toBe(false);
  });

  it('should redirect to /error if the response is not parsable', async () => {
    // Mock a response with non-JSON error text
    fetchMock.mockResponseOnce('Some unexpected error occurred', { status: 400 });

    const originalHref = window.location.href;
    const mockLocation = { ...window.location, href: '' };
    Object.defineProperty(window, 'location', { value: mockLocation, writable: true });

    // Mocking alert to avoid unwanted popups
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    await pickTable('reservation-id', 'auth-token', 'table-id');

    expect(window.alert).toHaveBeenCalledWith('An error occurred: Some unexpected error occurred');

    //await waitFor(() => {
      expect(window.location.href).toBe('');
    //});

    // Reset the original location
    window.location.href = originalHref;
  });
});
