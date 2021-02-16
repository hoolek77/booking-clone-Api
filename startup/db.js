const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/ExampleDbName", { useNewUrlParser: true })
    .then(() => console.info("Connected to MongoDB..."));
};
