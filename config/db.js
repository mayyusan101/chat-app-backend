const mongoose = require("mongoose");
const colors = require("colors");
colors.setTheme({
  warn: "yellow",
  debug: "blue",
  error: "red",
});

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("You successfully connected to MongoDB!".debug);
  } catch (err) {
    console.log("MonDB connect error".error, err);
  }
}

module.exports = dbConnect;
