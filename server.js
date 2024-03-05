const express = require('express');
const db = require('./config/connection');
// Import routes here
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Add in routes here
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server is listening at PORT ${PORT}`)
    })
})