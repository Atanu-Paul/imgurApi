const { Router } = require("express");
const router = Router();
const upload = require("../utils/multer");

const authenticate = require('../middlewares/authenticate');

const { userRegister, userLogin,  userImageUpdate, publicImage,allImage } = require('../controllers/userController');
const { route } = require("../app");

router.post('/user/register', userRegister);

router.post('/user/login', userLogin);


router.post("/user/imageupload/:token", authenticate, upload.array("file",10), userImageUpdate);


router.get('/publicimages', publicImage)
router.get('/images/:token',authenticate,allImage)


module.exports = router;