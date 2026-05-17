export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api/auth).*)"],
};
