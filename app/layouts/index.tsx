import { Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types";
import { getUserId } from "~/services/session";

export async function loader({ request }: Route.LoaderArgs) {
    // Check if the user is already logged in
    
    const userId = await getUserId(request);
    if (!userId) {
        throw redirect("/login");
    } else {
        return { userId };
    }
}
export default function RootLayout() {
    return (
        <div className="h-full flex flex-col">
            <header className="bg-gray-800 text-white p-4">
                <nav className="flex justify-between">
                    <p>React Router</p>
                    <div className="flex space-x-4">
                        <Link to="/post/new" className="hover:underline">
                            Create
                        </Link>
                        <Link to="/logout" className="hover:underline">
                            Logout
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    )
}
