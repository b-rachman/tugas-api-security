const User = require('../models/userModel')
const Kasir=require('../models/kasirModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { roles } = require('../roles')

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.jabatan)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "Anda tidak memiliki wewenang"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "Anda harus login terlebih dahulu"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

exports.signup = async (req, res, next) => {
  try {
    const { nama_belakang, username, password, jabatan } = req.body
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ nama_belakang,username, password: hashedPassword, jabatan : jabatan || "kasir" });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      message: "Login telah berhasil"
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return next(new Error('Email tidak tersedia'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password salah'))
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
      data: { username: user.username, jabatan: user.jabatan },
      accessToken
    })
  } catch (error) {
    next(error);
  }
}

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User tidak tersedia'));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const { jabatan } = req.body
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { jabatan });
    const user = await User.findById(userId)
    res.status(200).json({
      data: user,
      message: 'Update berhasil dilakukan'
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User telah dihapus'
    });
  } catch (error) {
    next(error)
  }
}

exports.addPrice = async(req,res,next)=>{
    try {
        const { nama_barang, harga, saldo_total} = req.body
        const newKasir = new Kasir({nama_barang,harga,saldo_total});
        await newKasir.save();
        res.json({
          message: "Berhasil ditambahkan"
        })
    } catch (error) {
        next(error)
    }
}

exports.getPrice = async(req,res,next)=>{
    const price = await Kasir.find({});
    res.status(200).json({
        data: price
  });
}

