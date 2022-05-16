const { User } = require('../models');

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
    createUser(req, res) {
		User.create(req.body)
		.then((dbUserData) => res.json(dbUserData))
		.catch((err) => res.status(500).json(err));
	},
    updateUserById(req, res) {
		User.findOneAndUpdate({
            _id: req.params.userId
        },
            req.body,
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
