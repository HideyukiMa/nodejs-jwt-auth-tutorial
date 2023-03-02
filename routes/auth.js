const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { User } = require("../db/User");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hello Auth");
});

//ユーザー新規登録用API
//email,passwordを受け取る
router.post(
  "i",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //入力欄のバリデーション
    const errors = validationResult(req);
    //バリデーションに失敗した場合
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //DBにユーザーが存在するか確認
    const user = User.find((user) => user.email === email);
    //ユーザーが存在した場合
    if (user) {
      return res.status(400).json([
        {
          message: "User already exists",
        },
      ]);
    }

    //パスワードのハッシュ化
    let hashedPassword = await bcrypt.hash(password, 10);

    //ユーザーをDBに登録
    User.push({
      email: email,
      password: hashedPassword,
    });

    //クライアントへJWTの発行
    const token = await JWT.sign(
      {
        email,
      },
      "SECRET_KEY",
      {
        expiresIn: "24h",
      }
    );
    console.log(email, password);

    return res.json({ token: token });
  }
);

//ユーザーログイン用API
//email,passwordを受け取る
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //DBにユーザーが存在するか確認
    const user = User.find((user) => user.email === email);
    //ユーザーが存在しない場合
  if (!user) {
    return res.status(400).json([
        {
        message: "User does not exist",
      },
    ]);
  }
  //パスワードの復号、照合
  const isMatch = await bcrypt.compare(password, user.password);
  //照合に失敗した場合
  if (!isMatch) {
    return res.status(400).json([
      {
        message: "Incorrect password",
      },
    ]);
  }
  //クライアントへJWTの発行
  const token = await JWT.sign(
    {
      email,
    },
    "SECRET_KEY",
    {
      expiresIn: "24h",
    }
  );
  return res.json({ token: token,
 });
});

// テスト用API
// ユーザー一覧を返す
router.get("/allUsers", (req, res) => {
  return res.json(User);
});

module.exports = router;
