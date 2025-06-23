import { Outlet, redirect } from "react-router";

export default function AuthLayout() {
    return (
        <>
            <Outlet />
        </>
    )
}