export const registerSchema = {
  title: 'register',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 30
    },
    password: {
      type: 'string',
      maxLength: 30
    }
  },
  required: ['username', 'password']
};
