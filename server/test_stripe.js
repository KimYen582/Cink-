import Stripe from 'stripe';

try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("Stripe instantiated");
} catch (error) {
  console.error("Stripe error:", error.message);
}
