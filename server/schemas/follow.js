const Follow = require('../models/follow');
const Post = require('../models/post');
// const User = require('../models/user');

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.


  type Follow {
    _id: ID,
    followingId: ID,
    followerId: ID,
    createdAt: String,
    updatedAt: String
  }


  type Mutation {
    follow(followingId: ID): Follow,
  }
`;

const resolvers = {
  Mutation: {
    follow: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const follow = await Follow.addFollow(args.followingId, user.userId);
      return follow;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
