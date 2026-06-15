const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, findUserByEmail, findUserById } = require('../models/userModel')
const { validateRegisterInput, validateLoginInput } = require('../utils/validators')

const SALT_ROUNDS = 10

const generateToken = (userId) => {
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const validationError = validateRegisterInput({ name, email, password })
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError })
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await createUser({ name: name.trim(), email, passwordHash })
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      data: { token, user },
      message: 'Account created successfully'
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const validationError = validateLoginInput({ email, password })
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const token = generateToken(user.id)

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      },
      message: 'Logged in successfully'
    })
  } catch (error) {
    next(error)
  }
}

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
}