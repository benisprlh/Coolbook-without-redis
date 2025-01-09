const { ObjectId } = require('mongodb');
const { getDb } = require('../config/mongo');

class Post {
  static async getAll() {
    try {
      const post = getDb()
        .collection('Posts')
        .aggregate([
          {
            $sort: { createdAt: -1 },
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'User',
            },
          },
        ])
        .toArray();
      return post;
    } catch (error) {
      throw error;
    }
  }

  static async getPostById(id) {
    try {
      if (!id) {
        throw new GraphQLError('Id is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const post = await getDb()
        .collection('Posts')
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'comments.authorId',
              foreignField: '_id',
              as: 'commentUsers',
            },
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'likes.authorId',
              foreignField: '_id',
              as: 'likeUsers',
            },
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'User',
            },
          },
        ])
        .toArray();
      return post[0];
    } catch (error) {
      throw error;
    }
  }

  static async addPost({ content, tags, imgUrl }, authorId) {
    try {
      if (!content) {
        throw new GraphQLError('Content is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const newDate = new Date();
      const data = getDb().collection('Posts');
      const post = await data.insertOne({ content, tags, imgUrl, authorId: new ObjectId(authorId), comments: [], likes: [], createdAt: newDate, updatedAt: newDate });
      const newPost = await data.findOne({ _id: post.insertedId });
      return newPost;
    } catch (error) {
      throw error;
    }
  }

  static async addComment({ idPost, content }, authorId) {
    try {
      if (!content) {
        throw new GraphQLError('Content is required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const newDate = new Date();
      const data = getDb().collection('Posts');
      await data.updateOne({ _id: new ObjectId(idPost) }, { $push: { comments: { content, authorId: new ObjectId(authorId), createdAt: newDate, updatedAt: newDate } } });

      const updatePost = await data.findOne({ _id: new ObjectId(idPost) });

      return updatePost;
    } catch (error) {
      throw error;
    }
  }

  static async addLike({ idPost }, authorId) {
    try {
      const newDate = new Date();
      const post = await getDb()
        .collection('Posts')
        .findOne({ _id: new ObjectId(idPost) });
      const data = getDb().collection('Posts');
      const findLikeIndex = post.likes.findIndex((el) => el.authorId.toString() === authorId);
      if (findLikeIndex == -1) {
        await getDb()
          .collection('Posts')
          .updateOne({ _id: new ObjectId(idPost) }, { $addToSet: { likes: { authorId: new ObjectId(authorId), createdAt: newDate, updatedAt: newDate } } });
      } else {
        post.likes.splice(findLikeIndex, 1);

        await getDb()
          .collection('Posts')
          .updateOne({ _id: new ObjectId(idPost) }, { $set: { likes: post.likes } });
      }

      const updatePost = await data.findOne({ _id: new ObjectId(idPost) });

      return updatePost;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
