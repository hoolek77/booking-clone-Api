const express = require("express");
const example = require("../routes/example");

module.exports = function (app) {
  app.use(express.json());

  app.use("/api/users", example);
};
