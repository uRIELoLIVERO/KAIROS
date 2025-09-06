import { UserModel } from "../models/sequelize/sequelize.js"

export class UserController {
    static async getUserByEmail(req, res) {
        try {
            const { email } = req.params //falta validar email
            
            const user = await UserModel.findOne({where: { email: email }})

            if(!user) return res.status(404).json({ error: 'User not found'})
                
            return res.status(200).json(user)
        } catch (error) {
            console.error('Error searching User:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}