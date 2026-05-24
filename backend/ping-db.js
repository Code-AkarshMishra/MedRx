const mongoose = require('mongoose');

async function keepDbAwake() {
  try {
    // Connect to your DB using the URI from your environment variables
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Send a lightweight ping command
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("MongoDB pinged successfully! Cluster won't sleep.");
    
    process.exit(0);
  } catch (error) {
    console.error("Database ping failed:", error);
    process.exit(1);
  }
}

keepDbAwake();