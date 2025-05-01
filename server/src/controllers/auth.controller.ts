import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware';

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, mobile, password, firstName, lastName } = req.body;
            
            // Check if user already exists
            const existingUser = await db.select()
              .from(users)
              .where(email ? eq(users.email, email) : eq(users.mobile, mobile))
              .limit(1);
              
            if (existingUser.length > 0) {
              throw new AppError('User already exists', 400);
            }
            
            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);
            
            // Create the user
            const [newUser] = await db.insert(users)
              .values({
                email,
                mobile,
                firstName,
                lastName,
                passwordHash,
                isActive: true
              })
              .returning();
              
            // Remove sensitive data
            const { passwordHash: _, ...userWithoutPassword } = newUser;
            
            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
              throw new AppError('Email and password are required', 400);
            }
            
            // Find the user
            const user = await db.select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);
              
            if (user.length === 0) {
              throw new AppError('Invalid credentials', 401);
            }
            
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash || '');
            
            if (!isPasswordValid) {
              throw new AppError('Invalid credentials', 401);
            }
            
            // Generate JWT token
            const token = jwt.sign(
              { userId: user[0].id }, 
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '24h' }
            );
            
            // Remove sensitive data
            const { passwordHash: _, ...userWithoutPassword } = user[0];
            
            res.status(200).json({
              success: true,
              message: 'Login successful',
              token,
              user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static async requestOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const { mobile } = req.body;
            
            if (!mobile) {
              throw new AppError('Mobile number is required', 400);
            }
            
            // Check if user exists
            const user = await db.select()
              .from(users)
              .where(eq(users.mobile, mobile))
              .limit(1);
              
            if (user.length === 0) {
              throw new AppError('User not found', 404);
            }
            
            // In a real application, generate and send OTP via SMS
            // For now, we'll simulate sending an OTP
            const otp = '123456'; // This should be randomly generated and stored
            
            res.status(200).json({
              success: true,
              message: 'OTP sent successfully to your mobile number'
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyOTP(req: Request, res: Response, next: NextFunction) {
        try {
            const { mobile, otp } = req.body;
            
            if (!mobile || !otp) {
              throw new AppError('Mobile number and OTP are required', 400);
            }
            
            // In a real application, verify OTP from database
            // For this example, we'll accept "123456" as a valid OTP
            if (otp !== '123456') {
              throw new AppError('Invalid OTP', 401);
            }
            
            // Find user by mobile number
            const user = await db.select()
              .from(users)
              .where(eq(users.mobile, mobile))
              .limit(1);
              
            if (user.length === 0) {
              throw new AppError('User not found', 404);
            }
            
            // Generate JWT token
            const token = jwt.sign(
              { userId: user[0].id }, 
              process.env.JWT_SECRET || 'your-secret-key',
              { expiresIn: '24h' }
            );
            
            // Remove sensitive data
            const { passwordHash: _, ...userWithoutPassword } = user[0];
            
            res.status(200).json({
              success: true,
              message: 'OTP verified successfully',
              token,
              user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user profile
    static async getUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // Cast to AuthenticatedRequest to access user property
            const { userId } = (req as AuthenticatedRequest).user;
            
            const user = await db.select()
              .from(users)
              .where(eq(users.id, userId))
              .limit(1);
              
            if (user.length === 0) {
              throw new AppError('User not found', 404);
            }
            
            // Remove sensitive data
            const { passwordHash: _, ...userWithoutPassword } = user[0];
            
            res.status(200).json({
              success: true,
              user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;