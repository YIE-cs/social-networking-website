const { ObjectId } = require("mongodb");
const path = require("path");

const createPost = async (req, res) => {
  //check if user is logged in 
  if (!req.session?.userId) return res.status(401).json({ success: false }); 

  const text = req.body.text?.trim();

  if (!text && !req.file) {
    return res.status(400).json({ success: false, message: "Text or image required" });
  }
  //include these along with the post
  //new post should contain 0likes and comments by default
  const newPost = {
    authorId: ObjectId.createFromHexString(req.session.userId),
    authorUsername: req.session.username || "User",
    text: text || "",
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    createdAt: new Date(),
    likes: [],           
    comments: []
  };

  try {
    await req.db.collection('contents').insertOne(newPost);
    res.json({ success: true });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false });
  }
};

const searchContents = async (req, res) => {
  //sort post by new old top
  const q = (req.query.q || "").trim();
  const sortParam = req.query.sort || "new"; 
  const filter = q ? { text: { $regex: q, $options: 'i' } } : {};

  try {
    let contents = await req.db.collection('contents')
      .find(filter)
      .toArray();
  
    if (sortParam === "old") {
      //if a is earlier than b oldest post appear first 
      contents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortParam === "top") {
      contents.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      //default(newest first)
      contents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    contents = contents.slice(0, 30); 

    res.json({ success: true, contents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const ForYouPage = async (req, res) => {
  //check user is logged in
  if (!req.session?.userId) return res.status(401).json({ success: false });
  const sortParam = req.query.sort || "new"; 

  try {
  
    const currentUserId = ObjectId.createFromHexString(req.session.userId);

    const currentUser = await req.db.collection("users").findOne(
      { _id: currentUserId },
      { projection: { following: 1 } } //returns only the following field 
    );
    //create array of users whose post should appear 
    const authorIdsToShow = currentUser?.following || [];
    authorIdsToShow.push(currentUserId);

    let feed = await req.db.collection('contents')
      .find({ authorId: { $in: authorIdsToShow } })
      .toArray();
    //sort by old top new 
    if (sortParam === "old") {
      feed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortParam === "top") {
      feed.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else {
      feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    feed = feed.slice(0, 20); // 20 posts 

    res.json({ success: true, feed });

  } catch (err) {
    console.error("error in showing feed:", err);
    res.status(500).json({ success: false });
  }
};

const likePost = async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ success: false });

  const { postId } = req.body;
  if (!postId) return res.status(400).json({ success: false });

  try {
    const postObjectId = ObjectId.createFromHexString(postId);
    const userObjectId = ObjectId.createFromHexString(req.session.userId);
    //update _id of specific post 
    const result = await req.db.collection('contents').updateOne(
      { _id: postObjectId },
      //add if only its not present 
      { $addToSet: { likes: userObjectId } } 
    );

    res.json({ success: true, liked: result.modifiedCount > 0 });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const unlikePost = async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ success: false });

  const { postId } = req.body;
  if (!postId) return res.status(400).json({ success: false });

  try {
    const postObjectId = ObjectId.createFromHexString(postId);
    const userObjectId = ObjectId.createFromHexString(req.session.userId);
      //update _id of specific post 
    await req.db.collection('contents').updateOne(
      { _id: postObjectId },
      //remove the user from likes 
      { $pull: { likes: userObjectId } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const addComment = async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ success: false });

  const { postId, text } = req.body;
  if (!postId || !text?.trim()) return res.status(400).json({ success: false });
  //comment object 
  try {
    const comment = {
      _id: new ObjectId(),
      authorId: ObjectId.createFromHexString(req.session.userId),
      authorUsername: req.session.username,
      text: text.trim(),
      createdAt: new Date()
    };
    //push comment into comments array
    await req.db.collection('contents').updateOne(
      { _id: ObjectId.createFromHexString(postId) },
      { $push: { comments: comment } }
    );

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  createPost,
  searchContents,
  ForYouPage,
  likePost,
  unlikePost,
  addComment
};