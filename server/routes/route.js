const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'),userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers)

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.post('/kasir', userController.allowIfLoggedin, userController.addPrice)

router.get('/kasir/data',userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'),userController.getPrice)

module.exports = router;