import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

export const signInUserWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  await setPersistence(auth, browserLocalPersistence);
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("An error occurred with pop up when signing in:", error);
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("An error occurred when signing out:", error);
  }
};
