import axios from 'axios';
import { serverUrl } from './config';
export const loginCall = async (user, dispatch) => {
  dispatch({ type: 'LOGIN_START' });
  try {
    console.log(user);
    const res = await axios.post(serverUrl, user);
    localStorage.setItem('user', JSON.stringify(res.data));
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error });
  }
};
