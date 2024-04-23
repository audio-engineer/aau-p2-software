import type { User } from "@firebase/auth";
import type { JWTPayload } from "jose";

export type SessionUser = Pick<User, "uid">;

export interface SessionPayload extends JWTPayload, SessionUser {
  readonly maxAge: number;
}
