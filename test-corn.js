const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log("Cron is running every minute");
});
