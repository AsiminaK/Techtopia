const express = require('express');
const cors = require('cors');
const myRoutes = require('./routes/routes');

const app = express();
const port = 3000;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes from the routes directory
app.use(myRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});