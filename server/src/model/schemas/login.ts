export const loginSchema = {
  title: 'login',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      maxLength: 30
    },
    password: {
      type: 'string',
      maxLength: 30
    }
  },
  required: ['username', 'password']
};
