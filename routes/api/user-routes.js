const router = require('express').Router();
const { User, Thoughts } = require('../../models');

// api/users
router.get('/', async (req, res) => {
    // The below ensures that when we GET all users, it will also display all the users' thoughts as well as the reactions to those thoughts
    try {
        const users = await User.find({}).populate({
            path: 'thoughts',
            populate: {
                path: 'reactions',
                model: 'Reaction' // Specify the model for reactions
            }
        });
        res.json(users);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Fetch a specific user by their user ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'thoughts',
            populate: {
                path: 'reactions',
                model: 'Reaction' // Specify the model for reactions
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).json({ error: 'Error fetching user' });
    }
});


router.post('/', async (req, res) => {
    try {
   const dbUserData = await User.create(req.body);
   res.status(200).json(dbUserData);
    }
    catch(err) {
        res.status(500).json(err)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        await Thoughts.deleteMany({ _id: { $in: deletedUser.thoughts }});
        res.status(200).json({ message: 'User and associated thoughts have been deleted successfully', deletedUser });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// The below is the put route to update a specifc user by the ID in the URL; and updating it with the information passed in the body of the request. The response should also display the new, updated value
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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