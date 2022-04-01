const { User } = require('../models');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({});
            res.json(users);
        } catch (e) {
            res.json(e);
        }
    },
    getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate({
				path: "thoughts",
				select: "-__v",
			})
			.populate({
				path: "friends",
				select: "-__v",
			})
			.select("-__v")
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this id." });
					return;
				}
				res.status(200).json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
    createUser: async (req, res) => {
        const {
            username,
            email,
        } = req.body;
        try {
            const newUser = await User.create({
                username,
                email,
            });
            res.json(newUser);
        } catch (e) {
            res.json(e);
        }
    },
    updateUserById({ params, body }, res) {
		User.findOneAndUpdate({
            _id: params.id
        },
            body,
            {
			new: true,
			runValidators: true,
		})
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
    deleteUserById({ params }, res) {
		User.findOneAndDelete({ _id: params.id })
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
    addNewFriend({ params }, res) {
		User.findOne({ _id: params.friendId })
			.then((friendData) => {
				if (!friendData) {
					res
						.status(404)
						.json({ message: "No user/friend found with this id" });
					return;
				}
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $push: { friends: friendData } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res
						.status(404)
						.json({ message: "No user/user found with this id" });
					return;
				}
				res.status(200).json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
    deleteFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } },
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
