import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

const router = express.Router();

router.post(
  '/stripe',
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        // Fallback for development without webhook secret (not recommended for production)
        event = JSON.parse(req.body);
      }
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.client_reference_id;

      if (bookingId) {
        try {
          const booking = await Booking.findById(bookingId);
          if (booking && booking.paymentStatus !== 'paid') {
            // Check if payment already exists
            const existingPayment = await Payment.findOne({ booking: bookingId, status: 'paid' });
            
            if (!existingPayment) {
              const transactionId = session.payment_intent || session.id;
              const payment = new Payment({
                _id: `pay_${Date.now()}`,
                booking: booking._id,
                user: booking.user,
                amount: booking.amount,
                method: 'credit_card',
                status: 'paid',
                transactionId,
                paidAt: Date.now(),
              });
              await payment.save();

              booking.paymentStatus = 'paid';
              booking.status = 'confirmed';
              await booking.save();
              
              console.log(`Booking ${bookingId} marked as paid via Webhook.`);
            }
          }
        } catch (error) {
          console.error("Error updating booking on webhook:", error);
          // Return 500 so Stripe retries
          return res.status(500).json({ error: 'Database update failed' });
        }
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send({ received: true });
  }
);

export default router;
