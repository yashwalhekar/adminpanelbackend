const cron = require("node-cron");
const Ad = require("../models/ads");

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    // Deactivate expired ads
    await Ad.updateMany(
      { endDate: { $lt: now }, isActive: true },
      { isActive: false }
    );

    // Activate ads whose startDate has arrived
    await Ad.updateMany(
      {
        startDate: { $lte: now },
        $or: [{ endDate: null }, { endDate: { $gte: now } }],
        isActive: false,
      },
      { isActive: true }
    );

    console.log("Ad statuses auto-updated at", now.toLocaleTimeString());
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
