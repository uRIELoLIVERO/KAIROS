import axios from 'axios'

class AuthAPI {
    static async getloggedUser() {
        const { data } = await axios.get(
            'http://localhost:3000/auth/me', {
            withCredentials: true
        });
    return data
    }
}

export default AuthAPI