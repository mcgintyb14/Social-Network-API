const router = require('express').Router();
const { Thoughts, User } = require('../../models');
const Reaction = require('../../models/Reaction');

// api/users
router.get('/', async (req, res) => {
    try {
        const users = await Thoughts.find({});
        res.json(users);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


router.post('/:userId', async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.userId);

        // If the user doesn't exist, return a 404 Not Found response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the new thought associated with the user
        const newThought = await Thoughts.create({
            thoughtText: req.body.thoughtText,
            username: user.username, // Use the username from the user object
            reactions: [] // Set reactions as an empty array for now
        });

        // Update the user's thoughts array with the ID of the new thought
        user.thoughts.push(newThought._id);
        await user.save();

        res.status(200).json(newThought);
    } catch (err) {
        console.error('Error creating thought:', err);
        res.status(500).json({ error: 'Error creating thought' });
    }
});

// Post a reaction to a specific thought
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const { reactionBody, username } = req.body;
        const { thoughtId } = req.params;

        // Check if the thought exists
        const thought = await Thoughts.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }

        // Create the new reaction associated with the thought
        const newReaction = new Reaction({
            reactionBody,
            username,
            thoughtId
        });

        // Save the new reaction to the database
        await newReaction.save();

        // Add the reaction to the thought's reactions array
        thought.reactions.push(newReaction);
        await thought.save();

        res.status(200).json(newReaction);
    } catch (err) {
        console.error('Error creating reaction:', err);
        res.status(500).json({ error: 'Error creating reaction' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await Thoughts.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// The below is the put route to update a specifc user by the ID in the URL; and updating it with the information passed in the body of the request. The response should also display the new, updated value
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await Thoughts.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
});


module.exports = router;