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
    getThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const thought = await Thought.findById(thoughtId);
            res.json(thought)
        } catch (e) {
            res.json(e);
        }
    },
    createThought: async (req, res) => {
        const { thoughtText, username, userId } = req.body;
        try {
            const newThought = await Thought.create({
                thoughtText,
                username,
                userId,
            });
            res.json(newThought);
        } catch (e) {
            res.json(e);
        }
    },
    updateThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                {...req.body},
                {
                    new: true,
                }
                );
                res.json(updatedThought);
        } catch (e) {
            res.json(e);
        }
    },
    deleteThoughtById: async (req, res) => {
        const { thoughtId } = req.params;
        try {
            const deletedThought = await Thought.findByIdAndDelete(thoughtId);
            res.json(deletedThought);
        } catch (e) {
            res.json(e);
        }
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
