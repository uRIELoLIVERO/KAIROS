import axios from "axios"

class UserAPI {
    static async getUserByEmail(email) {
        const user = await axios.get(
            `http://localhost:3000/users/${email}`, 
            { withCredentials: true }
        )
        return user
    }
}

export default UserAPI