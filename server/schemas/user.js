const User = require('../models/user');

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type UserFollow {
    _id: ID,
    name: String,
    username: String
  }

  type Follow {
    _id: ID,
    followerId: ID,
    followingId: ID
  }


  type User {
    _id: ID,
    name: String,
    username: String!,
    email: String!,
    imgUrl: String
  }

  type UserDetail {
    _id: ID,
    name: String,
    username: String!,
    email: String!,
    imgUrl: String
    userFollowers: [Follow],
    userFollowing: [Follow],
    userFollowersDetail: [UserFollow],
    userFollowingsDetail: [UserFollow]
  }

  type Token {
    access_token: String
  }

  type Query {
    # users: [User],
    userId: UserDetail,
    userByName(name: String): UserDetail
  }

  type Mutation {
    register(name: String, username: String!, imgUrl: String email: String!, password: String!): Token,
    login(email: String, password: String): Token,

  }
`;

const resolvers = {
  Query: {
    // users: async () => {
    //   const users = await User.getAll();
    //   return users;
    // },
    userId: async (_, __, contextValue) => {
      const userLogin = await contextValue.authentication();

      const user = await User.getUserById(userLogin.userId);
      return user;
    },
    userByName: async (_, args, contextValue) => {
      await contextValue.authentication();

      const user = await User.getUserByName(args.name);
      return user;
    },
  },
  Mutation: {
    register: async (_, args) => {
      const token = await User.addUser(args);
      return token;
    },
    login: async (_, args) => {
      const token = await User.login(args);
      return token;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
