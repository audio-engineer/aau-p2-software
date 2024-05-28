import type { User } from "firebase/auth";
import type { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload, Pick<User, "uid"> {
  readonly maxAge: number;
}
