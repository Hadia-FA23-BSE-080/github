require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.send('Stripe Payment Server is running');
});

// Route to create Stripe checkout session
app.post('/create-payment', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of products.' });
        }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr', // Change to 'usd' if needed
                product_data: {
                    name: product.name,
                    images: product.image ? [product.image] : [],
                },
                unit_amount: product.price * 100, // Stripe expects amount in subunits (paise/cents)
            },
            quantity: product.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Success and Cancel routes for testing
app.get('/success', (req, res) => {
    res.send('<h1>Payment Successful!</h1><p>Thank you for your purchase.</p>');
});

app.get('/cancel', (req, res) => {
    res.send('<h1>Payment Cancelled</h1><p>You can try again later.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
