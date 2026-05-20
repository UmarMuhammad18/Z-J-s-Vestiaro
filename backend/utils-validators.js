// utils/validators.js - Input Validation Utilities
import validator from 'validator';

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phone) => {
  return validator.isMobilePhone(phone, 'any');
};

export const validateProductData = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }
  if (!data.price || parseFloat(data.price) <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  if (!data.category_id) {
    errors.category_id = 'Category is required';
  }
  
  return errors;
};

export const validateOrderData = (data) => {
  const errors = {};
  
  if (!data.user_id) {
    errors.user_id = 'User ID is required';
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'At least one item is required';
  }
  if (!data.shipping_address) {
    errors.shipping_address = 'Shipping address is required';
  }
  
  return errors;
};
