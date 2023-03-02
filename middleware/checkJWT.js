const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  //JWTを持っているか確認 x-auth-token
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).json([
      {
        message: "No token, authorization denied",
      },
    ]);
  } else {
    try {
      //JWTの復号
      let user = await JWT.verify(token, "SECRET_KEY");
      console.log(user);
      req.user = user.email;
      next();
    } catch (error) {
      return res.status(400).json([
        {
          message: "Invalid token",
        },
      ]);
    }
  }
};
