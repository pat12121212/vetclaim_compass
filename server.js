require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const Stripe = require('stripe');
const twilio = require('twilio');
const { Configuration, OpenAIApi } = require('openai');

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure services
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 1. Generate VA Statement
app.post('/api/generate-statement', async (req, res) => {
  try {
    const { veteranName, serviceDetails, condition, onsetDate, symptomImpact } = req.body;
    const systemMsg = { role: 'system', content: 'You are a helpful VA claim assistant. Generate a VA Form 21-4138 “Statement in Support of Claim”.' };
    const userMsg = { role: 'user', content: JSON.stringify({ veteranName, serviceDetails, condition, onsetDate, symptomImpact }) };
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [systemMsg, userMsg],
      max_tokens: 500,
      temperature: 0.7
    });
    res.json({ statement: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed.' });
  }
});

// 2. Presigned S3 upload URL
app.get('/api/upload-url', (req, res) => {
  const { fileName } = req.query;
  const params = { Bucket: process.env.S3_BUCKET, Key: fileName, Expires: 300 };
  const url = s3.getSignedUrl('putObject', params);
  res.json({ url });
});

// 3. Subscribe to COLA alerts
const colaSubscribers = [];
app.post('/api/subscribe-cola', (req, res) => {
  const { contact } = req.body;
  colaSubscribers.push(contact);
  res.json({ success: true });
});

// 4. Send SMS reminder
app.post('/api/schedule-reminder', async (req, res) => {
  try {
    const { to, body } = req.body;
    await twilioClient.messages.create({ from: process.env.TWILIO_FROM, to, body });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Twilio send failed.' });
  }
});

// 5. Stripe webhook for checkout
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // TODO: Mark user as subscribed in your database
  }
  res.json({ received: true });
});

// Health check
app.get('/', (req, res) => res.send('VetClaim Compass API is running.'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
