const { ObjectId } = require("mongodb");
const followUser = async (req, res) => {
  //check if user is logged in
  if (!req.session?.userId) { 
    return res.status(401).json({ success: false, message: "User not logged in" });
  }

  const { followId } = req.body;                 
  if (!followId) {
    return res.status(400).json({ success: false, message: "No user ID" });
  }
  //cater for trying to follow yourself
  if (req.session.userId === followId) {
    return res.status(400).json({ success: false, message: "You cannot follow yourself" });
  }
  //converts id to object id
  try {
    const currentUserId = ObjectId.createFromHexString(req.session.userId);
    const targetUserId  = ObjectId.createFromHexString(followId);

    const targetUser = await req.db.collection("users").findOne({ _id: targetUserId });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    //check if u already follow the user 
    const alreadyFollowing = await req.db.collection("users").findOne({
      _id: currentUserId,
      following: targetUserId
    });

    if (alreadyFollowing) {
      return res.status(400).json({ success: false, message: "Already following this user" });
    }
    //update following array for you, follower array for user being followed 
    await req.db.collection("users").updateOne(
      { _id: currentUserId },
      { $addToSet: { following: targetUserId } }
    );

    await req.db.collection("users").updateOne(
      { _id: targetUserId },
      { $addToSet: { followers: currentUserId } }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("error occurred while following, please try again:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const unfollowUser = async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, message:"user not logged in" });
  }
  //same as follow, cannot unfollow yourself
  const { followId } = req.body;
  if (!followId || req.session.userId === followId) {
    return res.status(400).json({ success: false });
  }

  try {
    const currentUserId = ObjectId.createFromHexString(req.session.userId);
    const targetUserId  = ObjectId.createFromHexString(followId);
    //remove user u want to unfollow in following array & remove you in user's followers array

    await req.db.collection("users").updateOne(
      { _id: currentUserId },
      { $pull: { following: targetUserId } }
    );

    await req.db.collection("users").updateOne(
      { _id: targetUserId },
      { $pull: { followers: currentUserId } }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("error occurred while unfollowing:", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { followUser, unfollowUser };