const { isEmail } = require("validator");
const { User } = require("../models");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });

      res.json(users);
    } catch (error) {
      res.json(error);
    }
  },
  getUserById(req, res) {
    const { userId } = req.params;
    try {
      const user = User.findById(userId);
      res.json(user);
    } catch (error) {
      res.json(error);
    }
  },
  createUser: async (req, res) => {
    const { username, email } = req.body;
    if (!isEmail(email)) {
      return res
        .status(401)
        .json({ error: "Email must b a valid email address." });
    }
    try {
      const newUser = await User.create({
        username,
        email,
      });
      res.json(newUser);
    } catch (error) {
      res.json(error);
    }
  },
  updateUserById: async (req, res) => {
    const { userId } = req.params;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { ...req.body },
        {
          new: true,
          runValidators: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      res.json(error);
    }
  },
  deleteUserById: async (req, res) => {
    const { userId } = req.params;

    try {
      const deleteUserThoughts = await Thought.deleteMany({
        userId: userId,
      });
      const deletedUser = await User.findByIdAndDelete(userId);
      res.json(deletedUser);
    } catch (error) {
      res.json(error);
    }
  },
  addNewFriend(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((friendData) => {
        if (!friendData) {
          res
            .status(404)
            .json({ message: "No user/friend found with this id" });
          return;
        }
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $push: { friends: friendData } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user/user found with this id" });
          return;
        }
        res.status(200).json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.status(200).json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};
