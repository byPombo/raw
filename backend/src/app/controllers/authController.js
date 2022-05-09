const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require("../../config/auth")
const User = require('../models/User')
const { restart } = require('nodemon')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

// USER REGISTER
router.post('/register', async (req, res) => {
    const { email } = req.body

    try{
        if(await User.findOne({ email })){
            return res.status(400).send({ error: "E-mail já cadastrado" })
        }

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateToken({ id: user.id })
        })
    }catch(err){
        return res.status(400).send({ error: 'Falha no registro' })
    }
})

// USER AUTHENTICATION 
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user){
        return res.status(400).send({ error: "Usuário não encontrado"})
    }


    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: "Senha inválida" })
    }

    user.password = undefined

    res.send({ 
        user,
        token: generateToken({ id: user.id })
    })
})

// FORGOT PASSWORD ... TO USE? 
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email })

        if(!user){
        res.status(400).send({ error: 'Usuário não encontrado'})
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() +1)

        await  User.findByIdAndUpdate(user.id, {
            '$set': {
                'passwordResetToken': token,
                'passwordResetExpires': now,
            }
        })

        mailer.sendMail({
            to: email,
            from: 'dandan@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) =>{
            
        console.log(err)
            if(err){
                return res.status(400).send({ error: 'Não foi possível enviar e-mail de recuperação'})
            }

            return res.send();
        })

    }catch(err){
        res.status(400).send({ error: 'Erro ao recuperar a senha, tente novamente'})
    }
})

// RESET PASSWORD .. TO USE?
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try{
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')  

        if(!user){
            res.status(400).send({ error: 'Usuário não encontrado'})
        }

        if(token !== user.passwordResetToken){
            res.status(400).send({ error: 'Token inválido'})
        }

        const now = new Date()
        if(now > user.passwordResetExpires){
            res.status(400).send({ error: 'Token expirado'})
        }

        user.password = password

        await user.save()

        res.send()
    }catch(err){
        res.status(400).send({ error: 'Erro ao modificar a senha, tente novamente'})
    }
})

module.exports = app => app.use('/auth', router)