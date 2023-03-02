const router = require("express").Router();
const {privatePosts,publiPosts} = require("../db/Post");
const checkJWT = require("../middleware/checkJWT");

//誰でも見れる記事を取得するAPI
router.get("/public", (req, res) => {
    res.json(publiPosts);
});

//JWTを持っているユーザーしか見れない記事を取得するAPI
router.get("/private", checkJWT, (req, res) => {
    res.json(privatePosts);
});



module.exports = router;