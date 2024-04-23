import "server-only";

import { jwtVerify, SignJWT } from "jose";
import type { SessionPayload, SessionUser } from "@/types/session";
import { cookies } from "next/headers";

const encodedKey = new TextEncoder().encode(process.env.SECRET_KEY);

const secondsInMinute = 60;
const minutesInHour = 60;
const hoursInDay = 24;
const daysInWeek = 7;
const oneWeek = secondsInMinute * minutesInHour * hoursInDay * daysInWeek;

export const encrypt = async (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  sessionPayload: SessionPayload,
): Promise<string> => {
  return new SignJWT(sessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

export const decrypt = async (
  sessionCookieValue: string,
): Promise<SessionPayload | undefined> => {
  try {
    const { payload } = await jwtVerify<SessionPayload>(
      sessionCookieValue,
      encodedKey,
      {
        algorithms: ["HS256"],
      },
    );

    return payload;
  } catch (error) {
    console.error("Failed to verify session", error);
  }

  return undefined;
};

export const createSession = async (uid: SessionUser["uid"]): Promise<void> => {
  const sessionCookieValue = await encrypt({
    uid,
    maxAge: oneWeek,
  });

  cookies().set("session", sessionCookieValue, {
    httpOnly: true,
    secure: true,
    maxAge: oneWeek,
    sameSite: "lax",
    path: "/",
  });
};

// eslint-disable-next-line @typescript-eslint/require-await
export const deleteSession = async (): Promise<void> => {
  cookies().delete("session");
};
