const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/bookingcloneDB", { useNewUrlParser: true })
    .then(() => console.info("Connected to MongoDB..."));
};
