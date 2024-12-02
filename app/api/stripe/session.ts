// /pages/api/stripe/session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sessionId } = req.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(200).json(session);
    } catch (error) {
      console.error('Error retrieving Stripe session:', error);
      res.status(500).json({ error: 'Failed to retrieve Stripe session' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
