const User = require('../model/User');
const Role = require('../model/Role');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authController {
    async register (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибки при регистрации", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (candidate) {
               return res.status(400).json({message: `Пользователь с ником ${username} уже зарегистрирован`})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "ADMIN"});
            const user = new User({username, password: hashPassword, roles: [userRole.value]});
            await user.save()
            return res.status(200).json({message:`Пользователь ${username} успешно зарегистрирован`})
        } catch (error) {
            console.log(error);
            res.status(400).json({message: "Registration error"})
        }
    };
    async login (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибки при входе", errors})
            }
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(400).json({message: `Пользователя с ником ${username} не существует`})
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: `Пароль не найден`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token, username})
        } catch (error) {
            console.log(error);
            res.status(400).json({message: "Login error"})
        }
    };
    async getUsers (req, res) {
        try {
            const users = await User.find();
            res.json(users)
        } catch (error) {
            console.log(error);
            // res.status(400).json({message: ""})
        }
    }
}

module.exports = new authController();