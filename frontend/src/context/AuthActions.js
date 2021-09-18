export const LoginStart = () => ({
  type: 'LOGIN_START',
});

export const LoginSuccess = () => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});

export const LoginFailure = () => ({
  type: 'LOGIN_FAILURE',
  payload: error,
});

export const Follow = (userId) => ({
  type: 'FOLLOW',
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: 'UNFOLLOW',
  payload: userId,
});
