import { jwtDecode } from "jwt-decode";
import axios from "axios";

export async function checkAdminAuth() {
    const token = localStorage.getItem("admintoken");
    if (!token) return false;

    try {
        // Decode token and check expiration
        const { exp }: any = jwtDecode(token);
        const now = Date.now() /1000;

        if (exp < now) {
            localStorage.removeItem("adminToken");
            return false;
        }
    } catch (err) {
        localStorage.removeItem("adminToken");
        return false;
    }

    //Verify with backend
    try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_url}/api/admin/verify`, {
            headers: { Authorization: `Bearer ${token}`},
        });
        return true;
    } catch (err) {
        localStorage.removeItem("adminToken");
        return false;
    }
}
