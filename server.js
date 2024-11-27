const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// all nodejs get request will redirect to apache homepage
app.get('*', (req, res) => {
    res.redirect('http://localhost/SEHS4517_GP/'); // Change '/other-page.html' to your desired destination
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to handle reservation data
app.post('/success', (req, res) => {
    const { customer_email_address, customer_name, order_number, start_time, total_amount, reservation_item } = req.body;

    // Render the success with the reservation details
    res.render('success', { customer_email_address, customer_name, order_number, start_time, total_amount, reservation_item });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});