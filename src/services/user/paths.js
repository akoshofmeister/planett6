export const basePath = 'http://planett6.tk:3000/';

export const getPath = (path) => {
  return `${basePath}${path}`;
};

export const PATHS = {
  USER: getPath('user'),
  LOGIN: getPath('user/login'),
  REGISTER: getPath('user/register')
};
