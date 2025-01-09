require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs: typeDefsUser, resolvers: resolversUser } = require('./schemas/user');
const { typeDefs: typeDefsPost, resolvers: resolversPost } = require('./schemas/post');
const { typeDefs: typeDefsFollow, resolvers: resolversFollow } = require('./schemas/follow');
const { connect } = require('./config/mongo');
const { authentication } = require('./auth/auth');

const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolversUser, resolversPost, resolversFollow],
  introspection: true,
});

connect()
  .then(() => {
    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
      context: ({ req }) => {
        return {
          authentication: () => authentication(req),
        };
      },
    });
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  });
