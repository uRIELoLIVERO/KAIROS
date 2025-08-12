
import { ProfessionalModel, UserModel } from '../models/sequelize/sequelize.js'
import { validatePartialUser, validateUser } from '../schemas/user.js'
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export class AuthController {
    static transformUserData(user) {
        const data = user.toJSON ? user.toJSON() : user;
        
        const transformedData = {
            id: data.id,
            firstName: data.first_name || data.firstName,
            lastName: data.last_name || data.lastName,
            email: data.client_id || data.clientId,
            phoneNumber: data.phone_number || data.phoneNumber
        };
        
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                delete transformedData[key];
            }
        });
        
        return transformedData;
    }

    static async register(req, res) {
        try {
            const resultUser = validatePartialUser(req.body)
            if (!resultUser.success) {
                return res.status(400).json({ error: resultUser.error.message })
            }


            const existUser = await UserModel.findOne({ where: { email: resultUser.data.email }})
            if (existUser) {
                return res.status(404).json({ error: "User with this email address has already been registered." });
            }

            const hashedPassword = await bcrypt.hash(resultUser.data.password, parseInt(process.env.SALT_ROUNDS));

            const newUser = await UserModel.create({
                ...resultUser.data,
                id: crypto.randomUUID(),
                globalRoleId: 2,
                password: hashedPassword
            })

            const newProfessional = await ProfessionalModel.create({
                id: crypto.randomUUID(),
                userId: newUser.id
            })
            

            return res.status(201).json({
                message: 'Professional user created successfully',
                user: AuthController.transformUserData(newUser),
                professional: (newProfessional)
            });

        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }

    static async login(req, res) {
        try {
            const resultUser = await validatePartialUser(req.body)
            if (!resultUser.success) {
                return res.status(400).json({ error: resultUser.error.message })
            }

            const dataUser = resultUser.data

            const user = await UserModel.findOne({ where: { email: dataUser.email}})

            if (!user) {
                return res.status(401).json({ error: 'User not found'})
            }

            const isValid = await bcrypt.compare(dataUser.password, user.password)
            
            if (!isValid) {
                return res.status(401).json({ error: 'User not found'})
            }

            // Firmar JWT
            const refreshToken = jwt.sign(
                { id: user.id, globalRoleId: user.globalRoleId },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            const accessToken = jwt.sign(
                { id: user.id, globalRoleId: user.globalRoleId },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            
            // Enviar como cookie segura
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 día
            });
            
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            });

            return res.status(200).json({
                message: 'Logged in successfully',
                user: AuthController.transformUserData(user)
            });
        } catch (error) {
            console.error('Error:', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
            });

            res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
            });

            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token provided' });
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const newAccessToken = jwt.sign(
            { id: decoded.id, globalRoleId: decoded.globalRoleId },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
            );

            res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({ message: 'Access token refreshed' });
        } catch (error) {
            console.error('Refresh token error:', error);
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }
    }


    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Email is required' });

            const user = await UserModel.findOne({ where: { email } });
            if (!user) return res.status(404).json({ error: 'User not found' });

            const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
            );

            const resetLink = `https://kairos.com/reset-password?token=${token}`;

            console.log(`🔗 Password reset link: ${resetLink}`);

            return res.status(200).json({
            message: 'Password reset link sent (check console)',
            resetLink
            });
        } catch (error) {
            console.error('Forgot password error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password required' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findByPk(decoded.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
            await user.update({ password: hashedPassword });

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Reset password error:', error);
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
    }


    static async me(req, res) {
        try {
            console.log(req.user)
            const user = await UserModel.findByPk(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            return res.status(200).json({ user: AuthController.transformUserData(user) });
        } catch (error) {
            console.error('Me error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}