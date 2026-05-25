import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database';
import { generateToken, AuthRequest } from '../middleware/auth';
import { AppErrorClass } from '../middleware/errorHandler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password, full_name } = req.body;

    if (!email || !username || !password) {
      throw new AppErrorClass('Please provide email, username and password', 400);
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existingUser) {
      throw new AppErrorClass('User already exists with this email or username', 400);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        username,
        password_hash,
        full_name: full_name || ''
      })
      .select()
      .single();

    if (error) {
      throw new AppErrorClass('Error creating user', 500);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          is_admin: user.is_admin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppErrorClass('Please provide email and password', 400);
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      throw new AppErrorClass('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new AppErrorClass('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          is_admin: user.is_admin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, full_name, avatar_url, is_admin, created_at')
      .eq('id', req.user!.id)
      .maybeSingle();

    if (!user) {
      throw new AppErrorClass('User not found', 404);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { full_name, avatar_url } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ full_name, avatar_url })
      .eq('id', req.user!.id)
      .select('id, email, username, full_name, avatar_url, is_admin')
      .maybeSingle();

    if (error || !user) {
      throw new AppErrorClass('Error updating profile', 500);
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
