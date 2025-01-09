const { ObjectId } = require('mongodb');
const { getDb } = require('../config/mongo');
const { hashPassword, verifyPass } = require('../helpers/bcrypt');
const { GraphQLError } = require('graphql');
const { signToken } = require('../helpers/jwt');

class User {
  static async getAll() {
    const data = getDb().collection('Users');
    const user = await data.find().toArray();
    return user;
  }

  static async getUserById(id) {
    const user = await getDb()
      .collection('Users')
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'Follow',
            localField: '_id',
            foreignField: 'followingId',
            as: 'userFollower',
          },
        },
        {
          $lookup: {
            from: 'Follow',
            localField: '_id',
            foreignField: 'followerId',
            as: 'userFollowing',
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'userFollowing.followingId',
            foreignField: '_id',
            as: 'userFollowingsDetail',
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'userFollower.followerId',
            foreignField: '_id',
            as: 'userFollowersDetail',
          },
        },
      ])
      .toArray();
    return user[0];
  }

  static async getUserByName(name) {
    const data = getDb().collection('Users');
    const user = await data.findOne({ name });
    return user;
  }

  static async addUser({ name, username, imgUrl, email, password }) {
    if (!username) {
      throw new GraphQLError('Username is required', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (!email) {
      throw new GraphQLError('Email is required', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (!password) {
      throw new GraphQLError('Password is required', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (!email.includes('@')) {
      throw new GraphQLError('Format email invalid', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    if (password.length < 5) {
      throw new GraphQLError('Minimal length password is 5', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const userWithEmail = await getDb().collection('Users').findOne({ email });

    if (userWithEmail) {
      throw new GraphQLError('Email or username is already', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const userWithUsername = await getDb().collection('Users').findOne({ username });

    if (userWithUsername) {
      throw new GraphQLError('Email or username is already', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const data = getDb().collection('Users');
    const hashPass = hashPassword(password);
    const user = await data.insertOne({ name, username, email, imgUrl, password: hashPass });
    const newUser = await data.findOne({ _id: user.insertedId });
    const token = signToken({ _id: newUser._id, email: newUser.email, username: newUser.username });

    return { access_token: token };
  }

  static async login({ email, password }) {
    const data = getDb().collection('Users');
    const user = await data.findOne({ email });
    if (!user) {
      throw new GraphQLError('User or Password is invalid', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const verifyPassword = verifyPass(password, user.password);

    if (!verifyPassword) {
      throw new GraphQLError('User or Password is invalid', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const token = signToken({ _id: user._id, email: user.email, username: user.username });

    return { access_token: token };
  }
}

module.exports = User;
