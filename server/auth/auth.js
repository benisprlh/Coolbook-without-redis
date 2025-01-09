const { GraphQLError } = require('graphql');
const { verifyToken } = require('../helpers/jwt');

function authentication(req) {
  if (!req.headers.authorization) {
    throw new GraphQLError('You have to login', {
      extensions: { code: 'AUTHENTICATED' },
    });
  }
  const user = verifyToken(req.headers.authorization.split(' ')[1]);
  if (!user) {
    throw new GraphQLError('Invalid Token', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  console.log(user.username);

  return {
    userId: user._id,
    email: user.email,
    username: user.username,
  };
}

module.exports = {
  authentication,
};
