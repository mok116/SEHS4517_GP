const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname))

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to handle reservation data
app.get('/success', (req, res) => {
    const { customer_email_address, customer_name, order_number, start_time, total_amount, reservation_item } = req.body;

    // Render the success with the reservation details
    res.render('success', { customer_email_address, customer_name, order_number, start_time, total_amount, reservation_item });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});