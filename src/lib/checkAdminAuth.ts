export async function checkAdminAuth() {
    //Verify with backend
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_url}/api/admin/verify`, {
           credentials: "include", // send Http-only cookie
        });
        if (!res.ok) return false;

        const data = await res.json();
        return data.ok === true;
    } catch {
        return false;
    }
}
