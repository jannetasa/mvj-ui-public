import { Action } from 'redux-actions';

export const FETCH_API_TOKEN = 'auth/FETCH_API_TOKEN';
export const RECEIVE_API_TOKEN = 'auth/RECEIVE_API_TOKEN';
export const TOKEN_NOT_FOUND = 'auth/TOKEN_NOT_FOUND';

export const fetchApiTokenActionType = (payload: string): Action<string> => {
  return {
    type: FETCH_API_TOKEN,
    payload,
  };
};
