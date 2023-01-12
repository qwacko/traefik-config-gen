import { auth } from "./lib/server/auth/auth";
import { handleHooks } from "@lucia-auth/sveltekit";

export const handle = handleHooks(auth);