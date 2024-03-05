const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);



router.use((req, res) => {
    return res.send("Try again. Wrong Route!") 
})

module.exports = router;