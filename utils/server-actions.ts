"use server";

import { createSession, decrypt, deleteSession } from "@/utils/session";
import type { User } from "@firebase/auth";
import type { SessionPayload } from "@/types/session";
import { cookies } from "next/headers";

export const createSessionCookie = async (uid: User["uid"]): Promise<void> => {
  await createSession(uid);
};

export const deleteSessionCookie = async (): Promise<void> => {
  await deleteSession();
};

export const verifySession = async (): Promise<SessionPayload | null> => {
  const sessionCookieValue = cookies().get("session")?.value;

  if (undefined === sessionCookieValue || "" === sessionCookieValue) {
    return null;
  }

  const sessionPayload = await decrypt(sessionCookieValue);

  if (undefined === sessionPayload) {
    return null;
  }

  return {
    uid: sessionPayload.uid,
    maxAge: sessionPayload.maxAge,
  };
};
