import { defaultConfig } from '../../../../../engine/constants';
import { Input } from '../../../../../engine/models';
import { CreateGameResponse, type FetchStateResponse } from '../../../../../shared/contract';
const BACKEND_BASE_URL = 'http://localhost:3000';

export const fetchGameState = async (gameId: string, clientId: number): Promise<FetchStateResponse> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/game/${gameId}?clientId=${clientId}`);
    if (!response.ok) {
      throw response;
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching game state:', error);
    throw error;
  }
};

export const postGameInput = async <T>(gameId: string, input: Input<T>, clientId: number) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/game/${gameId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    });
    if (!response.ok) {
      throw response;
    }
    return fetchGameState(gameId, clientId);
  } catch (error) {
    console.error('Error posting game input:', error);
    throw error;
  }
};

export const createNewGame = async (config = defaultConfig) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config })
    });
    if (!response.ok) {
      throw response;
    }
    const responseData: CreateGameResponse = await response.json()
    return responseData;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};
