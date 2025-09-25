export const USER_LOADED = "SET_USER";

export const userLoaded = (user) => ({
  type: USER_LOADED,
  payload: user,
});