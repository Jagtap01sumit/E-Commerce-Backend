const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    if (!req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const savedUser = await user.save();

    res.status(201).json({ id: savedUser.id, role: savedUser.role });
    console.log(user);
    console.log("User saved successfully");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create the User" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      res.status(200).json({ id: user.id, role: user.role });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
