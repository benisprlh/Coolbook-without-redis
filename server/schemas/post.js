const redis = require('../config/redis');
const Post = require('../models/post');
// const User = require('../models/user');

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type UserDetailPost{
    _id: ID,
    username: String,
    name: String,
    imgUrl: String
  }


  type Post {
    _id: ID,
    content: String!,
    tags: [String],
    imgUrl: String,
    authorId: ID!,
    comments: [Comment],
    likes: [Like],
    createdAt:String,
    updatedAt:String,
    User: [UserDetailPost]
  }

  type PostDetail {
    _id: ID,
    content: String!,
    tags: [String],
    imgUrl: String,
    authorId: ID!,
    comments: [Comment],
    likes: [Like],
    createdAt:String,
    updatedAt:String,
    commentUsers: [UserDetailPost],
    likeUsers: [UserDetailPost],
    User: [UserDetailPost]
  }

  

  type Comment {
    content: String!,
    authorId: ID!,
    createdAt:String,
    updatedAt:String
  }

  type Like {
    authorId: ID!,
    createdAt:String,
    updatedAt:String
  }

  type Query {
    posts: [Post],
    postById(id: ID): PostDetail,
  }

  input post {
    content: String!,
    tags: [String]!,
    imgUrl: String,
  }

  type Mutation {
    addPost(post: post): Post,
    commentPost(idPost: ID!, content: String!): Comment,
    likePost(idPost: ID!): Post
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, contextValue) => {
      await contextValue.authentication();
      // redis.del('post:all');
      let result;
      if (postCache) {
        result = JSON.parse(postCache);
      } else {
        const posts = await Post.getAll();
        result = posts;
      }
      return result;
    },
    postById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const post = await Post.getPostById(args.id);
      return post;
    },
  },

  Mutation: {
    addPost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const post = await Post.addPost(args.post, user.userId);
      return post;
    },
    commentPost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const post = await Post.addComment(args, user.userId);

      return post;
    },
    likePost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const post = await Post.addLike(args, user.userId);

      return post;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
