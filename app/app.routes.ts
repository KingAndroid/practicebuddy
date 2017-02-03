import { AuthGuard } from "./services/auth-guard.service";

export const authProviders = [
  AuthGuard
];

export const appRoutes = [
  { path: "", redirectTo: "/home", pathMatch: "full" }
];
