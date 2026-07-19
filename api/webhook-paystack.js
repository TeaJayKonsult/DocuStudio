const admin = require('firebase-admin');

// ====== INITIALIZE FIREBASE ADMIN ======
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ====== MAIN HANDLER ======
module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('📡 Webhook received');

  // Parse the event body
  const event = req.body;
  if (!event || !event.event) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  console.log(`📨 Event type: ${event.event}`);

  // ====== HANDLE CHARGE.SUCCESS ======
  if (event.event === 'charge.success') {
    try {
      const data = event.data;
      const metadata = data.metadata || {};
      
      // Extract user ID and plan from metadata
      let userId = null;
      let plan = null;
      
      // Check custom_fields array (sent from dashboard)
      if (metadata.custom_fields && Array.isArray(metadata.custom_fields)) {
        const userIdField = metadata.custom_fields.find(f => f.variable_name === 'user_id');
        const planField = metadata.custom_fields.find(f => f.variable_name === 'plan');
        if (userIdField) userId = userIdField.value;
        if (planField) plan = planField.value;
      }
      
      // Fallback: direct metadata fields
      if (!userId && metadata.user_id) userId = metadata.user_id;
      if (!plan && metadata.plan) plan = metadata.plan;

      console.log(`👤 User ID: ${userId}, Plan: ${plan}`);

      // Validate
      if (!userId || plan !== 'pro') {
        console.log('⚠️ Missing userId or plan not "pro"');
        return res.status(400).json({ error: 'Missing or invalid metadata' });
      }

      // ====== UPDATE USER IN FIRESTORE ======
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log(`❌ User ${userId} not found`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Update plan and subscription details
      await userRef.update({
        plan: 'pro',
        actionsRemaining: 999999, // Unlimited
        lastReset: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        subscription: {
          status: 'active',
          amount: data.amount ? data.amount / 100 : 700,
          currency: data.currency || 'NGN',
          reference: data.reference || null,
          paidAt: data.paid_at || null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      });

      // ====== LOG TRANSACTION ======
      await db.collection('transactions').add({
        userId: userId,
        type: 'subscription',
        plan: 'pro',
        amount: data.amount ? data.amount / 100 : 700,
        currency: data.currency || 'NGN',
        reference: data.reference || null,
        status: 'success',
        paystackData: data,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ User ${userId} upgraded to Pro`);
      return res.status(200).json({ 
        status: 'success', 
        message: `User ${userId} upgraded to Pro` 
      });

    } catch (error) {
      console.error('❌ Webhook error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message 
      });
    }
  }

  // Acknowledge other events (e.g., charge.failed, transfer.success, etc.)
  console.log(`📨 Event ${event.event} received but not handled`);
  return res.status(200).json({ 
    status: 'received', 
    event: event.event 
  });
};
