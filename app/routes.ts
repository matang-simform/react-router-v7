import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("layouts/index.tsx", [
        index("pages/home.tsx"),
        route("about", "pages/about.tsx"),
        route("logout", "pages/logout.tsx"),
        ...prefix("post", [
            route("new", "pages/create-post.tsx"),
            route(":postId", "pages/edit-post.tsx"),
        ]),
    ]),
    layout("layouts/auth.tsx", [
        route("register", "pages/register.tsx"),
        route("login", "pages/login.tsx"),
    ]),
    ...prefix('api', [
        route('posts', 'api/posts/index.ts')
    ]),
    route("*", "pages/page-not-found.tsx")
] satisfies RouteConfig;
