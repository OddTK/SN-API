const { Thought } = require('../models');

module.exports = {
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find({});
            res.json(thoughts);
        } catch (e) {
            res.json(e);
        }
    },
    getThoughtById({ params }, res) {
		Thought.findOne({ _id: params.id })
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
    createThought({ body }, res) {
		Thought.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: body.userId },
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
    updateThoughtById({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body {
            new: true,
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
    deleteThoughtById({ params }, res) {
		Thought.findOneAndDelete({ _id: params.thoughtId })
			.then((deletedThought) => {
				if (!deletedThought) {
					res.status(404).json({ message: "No thought found with this id" });
					return;
				}
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $pull: { thoughts: params.thoughtId } },
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

    addReaction(req, res) {
        console.log('You are adding an reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.studentId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((student) =>
            !student
                ? res
                    .status(404)
                    .json({ message: 'No student found with that ID :(' })
                : res.json(student)
            )
            .catch((err) => res.status(500).json(err));
        },
    removeReaction(req, res) {
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
