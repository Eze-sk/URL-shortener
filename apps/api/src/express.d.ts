import { User, Session } from "better-auth";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      session?: Session | null;
    }
  }
}

export { };