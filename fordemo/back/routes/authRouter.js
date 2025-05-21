const Router = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator')

const router = new Router();

router.post('/register', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен составлять от 6 до 12 символов').isLength({min: 6, max: 12})
], authController.register);
router.post('/login', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не может быть пустым').notEmpty()
], authController.login);
router.get('/users', authController.getUsers);

module.exports = router
