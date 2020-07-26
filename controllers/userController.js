const User = require('../models/User');
const Photo = require('../models/Photo')
const Fav = require('../models/Favourite')
const bcrypt = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const convertBufferToString = require("../utils/convertBufferToString");
const { sign } = require("jsonwebtoken");


module.exports = {
    async userRegister(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!email || !password || !name) {
                return res.status(400).send({ statusCode: 400, message: "Bad request" });
            }

            const createUser = await User.create({ name, email, password });
            const secretKey = `anuraggothi`;
            const accessToken = await sign({ id: createUser.id }, secretKey, {
                expiresIn: (1000 * 60 * 60*24).toString()
            });
            createUser.accessToken = accessToken
            await createUser.save()
            res.status(201).json({
                statusCode: 201,
                createUser,
                expiresIn: "24h"
            });
        } catch (err) {
            console.log(err.message)
            res.status(500).send(err.message);
        }
    },


    async userLogin(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ statusCode: 400, message: 'Invalid Credentials' });
            const user = await User.findByEmailAndPassword(email, password);
            const secretKey = `anuraggothi`;
            const accessToken = await sign({ id: user.id }, secretKey, {
                expiresIn: (1000 * 60 * 60*24).toString()
            });
            user.accessToken = accessToken;
            await user.save()
            res.status(200).json({
                statusCode: 200,
                user,
                accessToken: accessToken,
                expiresIn: "24h"
            });
        }
        catch (err) {
            if (err.name === 'AuthError') {
                res.json({ message: err.message })
            }
        }
    },


    async userImageUpdate(req, res) {
        const user = req.user;
        console.log(req.files)
        const { title, description} = req.body
        let privacy = req.body.privacy
        if(!req.body.privacy){
            privacy= 'public'
        }
        const token = req.params.token
        try {
            const urls = []
            for(i=0;i<req.files.length;i++){
                let imageContent = convertBufferToString(
                    req.files[i].originalname,
                    req.files[i].buffer
                );
                let imageUrl = await cloudinary.uploader.upload(imageContent)
                console.log(imageUrl)
                urls.push(imageUrl.secure_url);
                console.log(urls)
            }   
            const photo = await Photo.create({ url: urls.join(','), title: title, description: description, uploadedBy: user.id,privacy:privacy });
            res.json({ message: "Image uploaded Successfully", photo: photo });

        } catch (err) {
            console.log(err.message);
            res.json({ error: "Image Upload Error" });
        }
    },

    async publicImage(req,res){
        try{
            const images  = await Photo.findAll({
                where:{
                    privacy:'public'
                }
            })
            res.json({images})
        }
        catch (err) {
            res.json({ error: "Fetch Error" });
        }
    },
    async allImage(req,res){
        try{
            const images  = await Photo.findAll({})
            res.json({images})
        }
        catch (err) {
            res.json({ error: "Fetch Error" });
        }
    },

}