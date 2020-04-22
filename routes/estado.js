const express = require("express");

const router = express.Router();
const Controller = require("../controllers/estado");

router.get("/", (req, res) => {
  const status = Controller.getStatus();
  return res
    .status(200)
    .json(status)
    .end();
});

module.exports = router;
