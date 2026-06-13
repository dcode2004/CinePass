import { ROLES } from '../constants/index.js';
import { errorResponse } from '../utils/apiResponse.js';

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return errorResponse(res, 'Admin access required', 403);
  }
  next();
};

export const isUser = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }
  next();
};
