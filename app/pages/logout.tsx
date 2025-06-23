import { getUserId, logout } from "~/services/session";
import type { Route } from "./+types/logout";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
    // Check if the user is already logged in
    
    const userId = await getUserId(request);
    if (!userId) {
        throw redirect("/login");
    }

    return logout(request);
}


export default function LogoutPage() {
    return <></>
}