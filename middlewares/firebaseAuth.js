require("dotenv").config();
const axios = require("axios");
const admin = require("../services/firebase");

const getAuthToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res
      .status(401)
      .send({ error: "No esta autorizado para consumir este servicio." });
  }

  const token = authorization.split(" ");

  if (token[0] === "Bearer") {
    req.authToken = token[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  if (req.method !== "OPTIONS" && process.env.REQUIRE_AUTH === "true") {
    getAuthToken(req, res, async () => {
      try {
        const { authToken } = req;
        const userInfo = await admin.auth().verifyIdToken(authToken);

        const user = await admin.auth().getUser(userInfo.uid);
        const rol =
          user.customClaims &&
          Object.keys(user.customClaims).map(claim =>
            user.customClaims[claim] === true ? claim : null
          )[0];

        req.user = {
          uid: userInfo.uid,
          email: userInfo.email,
          name: userInfo.name,
          rol
        };

        axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        return next();
      } catch (e) {
        return res
          .status(401)
          .send({ error: "No esta autorizado para consumir este servicio." });
      }
    });
  } else {
    return next();
  }
};

module.exports = checkIfAuthenticated;
