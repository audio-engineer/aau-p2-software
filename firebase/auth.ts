import type { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import {
  createSessionCookie,
  deleteSessionCookie,
} from "@/utils/server-actions";

export const signInWithGoogle = async (): Promise<
  UserCredential | undefined
> => {
  const provider = new GoogleAuthProvider();

  let user: UserCredential | null = null;

  try {
    user = await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google", error);

    return undefined;
  }

  await createSessionCookie(user.user.uid);

  return user;
};

export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);

    return;
  }

  await deleteSessionCookie();
};
