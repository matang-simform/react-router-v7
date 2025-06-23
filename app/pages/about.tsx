import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Simform | About" },
    { name: "description", content: "Welcome to simform about page" },
  ];
}

export default function About() {
  return <h1>About Page</h1>
}
