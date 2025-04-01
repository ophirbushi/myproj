import { type FetchStateResponse } from '../../../../../shared/contract';
const BACKEND_BASE_URL = 'http://localhost:3000';

export const fetchGameState = async (): Promise<FetchStateResponse> => {
  try {
    const response = await fetch(BACKEND_BASE_URL);
    if (!response.ok) {
      throw response;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching game state:', error);
    throw error;
  }
};

export const postGameInput = async <T>(input: T) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/input`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    });
    if (!response.ok) {
      throw response;
    }
    return fetchGameState();
  } catch (error) {
    console.error('Error posting game input:', error);
    throw error;
  }
};

