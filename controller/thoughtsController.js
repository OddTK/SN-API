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
    createReaction: async (req, res) => {},
    deleteReaction: async (req, res) => {},
};
