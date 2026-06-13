import { validationResult } from 'express-validator';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 'Registration successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 'Login successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return errorResponse(res, 'Refresh token not found', 401);
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    return successResponse(res, 'Token refreshed', { accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 'Logged out successfully');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, 'User profile fetched', { user });
  } catch (error) {
    next(error);
  }
};
