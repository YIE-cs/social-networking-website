const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/userModel');

let db; 


exports.register = async (req, res) => {
  const { username, email, password, dob, phone } = req.body; //extracts these from request body

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "username, email or password cannot be blank" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); //hash password for secure storage
    const result = await createUser(db, {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      dob,
      phone,
      following:[],
      followers:[],
      createdAt:new Date()
    });

    if (result.success) {
      res.json({ success: true, message: "Registered successfully" });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(db, email.toLowerCase());
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    //compare input user with stored hashed password 
    const match = await bcrypt.compare(password, user.password); 
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    //stores userid & username in the session
    req.session.userId = user._id.toString();
    req.session.username = user.username;

    res.json({ 
      success: true, 
      message: "Login successful",
      user: { username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//check if user is logged in
exports.checkLogin = async (req, res) => {
  if (req.session.userId) {
    res.json({
      success: true,
      user: { username: req.session.username || "User" }
    });
  } else {
    res.json({ success: false });
  }
};

//calls req.session.destroy to log user out
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "sucessfully Logged out" });
  });
};
//allows db to be used
exports.setDB = (database) => {
  db = database;
};