const { isEmail } = require("validator");
const { User } = require("../models");

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
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
  updateUserById(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
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
  deleteUserById(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = User.findByIdAndDelete(userId);
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
