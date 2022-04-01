const { Thought } = require('../models');

module.exports = {
    getAllThoughts(req, res) {
        Thought.find({})
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getThoughtById(req, res) {
		Thought.findOne({ _id: req.params.id })
			.select("-__v")
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					res.status(404).json({ message: "No thought found with this id" });
					return;
				}
				res.status(200).json(dbThoughtData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
    createThought(req, res) {
		Thought.create(req.body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: req.body.userId },
					{ $push: { thoughts: _id } },
					{ new: true }
				);
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
    updateThoughtById(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {new: true,
            runValidators: true,
        }).then((updatedThought) => {
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }
            res.status(200).json(updatedThought);
        }).catch((err) => {
            console.log(err);
            res.json(err);
        })
    },
    deleteThoughtById(req, res) {
		Thought.findOneAndDelete({ _id: req.params.thoughtId })
			.then((deletedThought) => {
				if (!deletedThought) {
					res.status(404).json({ message: "No thought found with this id" });
					return;
				}
				return User.findOneAndUpdate(
					{ _id: req.params.userId },
					{ $pull: { thoughts: req.params.thoughtId } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this id" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
    createReaction(req, res) {
        console.log('You are adding an reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
        },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reaction: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
