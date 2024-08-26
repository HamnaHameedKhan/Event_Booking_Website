const express=require('express');
const router=express.Router();
const {signup,login,verify, allUser,updateUser}=require('../controllers/UserController');


router.post('/signup', signup);

router.post('/login', login);

router.get('/verifyToken', verify);

router.get('/allUsers',allUser)

router.put('/updateUser/:id',updateUser)


module.exports=router;