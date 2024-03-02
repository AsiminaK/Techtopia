const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const dbURI = require('./dbConfigs');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(dbURI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Init App
app.use(cors());
app.use(express.json());
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
