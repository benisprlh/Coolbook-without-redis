const { ObjectId } = require('mongodb');
const { getDb } = require('../config/mongo');

class Follow {
  static async addFollow(followingId, userId) {
    const date = new Date();

    const follow = await getDb()
      .collection('Follow')
      .findOne({ followingId: new ObjectId(followingId), followerId: new ObjectId(userId) });

    if (follow) {
      await getDb()
        .collection('Follow')
        .findOneAndDelete({ followingId: new ObjectId(followingId), followerId: new ObjectId(userId) });
    } else {
      await getDb()
        .collection('Follow')
        .insertOne({ followingId: new ObjectId(followingId), followerId: new ObjectId(userId), createdAt: date, updatedAt: date });
    }

    // const newFollow = getDb().collection('Follow').findOne({ _id: follow.insertedId });

    return getDb()
      .collection('Follow')
      .findOne({ followingId: new ObjectId(followingId), followerId: new ObjectId(userId) });
  }
}

module.exports = Follow;
