const { ObjectId } = require('mongodb');

const searchUsers = async (req, res) => {
  //reads query parameter(default if left empty)
  const q = (req.query.q || "").trim();

  try {
    let users;
    //randomly select 10 users as suggestions
    if (!q || q.length === 0) {
      users = await req.db.collection('users')
        .aggregate([{ $sample: { size: 10 } }])
        .project({ username: 1, _id: 1, followers: 1 })  
        .toArray();

      if (req.session.userId) {
        users = users.filter(u => u._id.toString() !== req.session.userId);
      }
    } else {
      //search user and limit results to 15
      users = await req.db.collection('users')
        .find({ username: { $regex: q, $options: 'i' } })
        .project({ username: 1, _id: 1, followers: 1 })  
        .limit(15)
        .toArray();
    }

    res.json({ success: true, users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyFollowing = async (req, res) => {
  if (!req.session?.userId) {
    return res.json({ success: true, following: [] });
  }

  try {
    const user = await req.db.collection('users').findOne(
      { _id: ObjectId.createFromHexString(req.session.userId) },
      //get only following array
      { projection: { following: 1 } } 
    );

    const following = user?.following || [];
    // id as strings and return the list
    const followingStrings = following.map(id => id.toString());

    res.json({ success: true, following: followingStrings });
  } catch (err) {
    console.error("getMyFollowing error:", err);
    res.json({ success: true, following: [] }); 
  }
};

module.exports = {
  searchUsers,
  getMyFollowing
};