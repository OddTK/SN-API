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
    getUserById: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await User.findById(userId)
            .populate({
                path: 'thoughts',
            })
            .populate({
                path: 'friends',
            });
            res.json(user);
        } catch (e) {
            res.json(e);
        }
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
    updateUserById: async (req, req) => {
        const {userId} = req.params;
        try {
            const updateUser = await User.findByIdAndUpdate(
                userId,
                {...req.body},
                {
                    new: true,
                    runValidators: true,
                }
                );
        } catch (e) {
            res.json(e);
        }
    },
    deleteUserById: async (req,res) => {
        const { userId } = req.params;
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            res.json(deletedUser);
        } catch (e) {
            res.json(e);
        }
    },
    addNewFriend: async (req, res) => {
        const { userId } = req.params;
        const { friend } = req.body;
        try {
            const updatedUser = await User.findByIdAndUpdate(userId,
                {
                    $push:{
                        friends: friend,
                    }
                },
                {
                    new: true,
                }
                );
                res.json(updatedUser);
        } catch (e) {
            res.json(e);
        }
    },
    deleteFriend: async (req,req,) => {
        const { userId } = req.params;
        const { friend } = req.body;
        try {
            const updatedUser = await User.findByIdAndUpdate(userId,
                {
                    $pull:{
                        friends: friend,
                    }
                },
                {
                    new: true,
                }
                );
                res.json(updatedUser)
        } catch (e) {
            res.json(e);
        }
    }
};
