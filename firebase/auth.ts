import type { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, getActiveUserRef } from "@/firebase/firebase";
import type { DataSnapshot } from "firebase/database";
import { get, remove, set, update } from "firebase/database";
import type { ActiveUser, ActiveUserRecord } from "@/types/database";
import {
  createSessionCookie,
  deleteSessionCookie,
} from "@/utils/server-actions";

const sessionCountBeforeRemoval = 1;
const sessionCountIncrement = 1;

const findActiveUser = async (
  uid: keyof ActiveUserRecord,
): Promise<DataSnapshot> => {
  return get(getActiveUserRef(uid));
};

const isUserActive = async (uid: keyof ActiveUserRecord): Promise<boolean> => {
  const snapshot = await findActiveUser(uid);

  return snapshot.exists();
};

const setUserAsActive = async (user: ActiveUserRecord): Promise<void> => {
  const [uid] = Object.keys(user);

  await set(getActiveUserRef(uid), {
    ...user[uid],
  });
};

const setUserAsInactive = async (
  uid: keyof ActiveUserRecord,
): Promise<void> => {
  const snapshot = await findActiveUser(uid);

  if (!snapshot.exists()) {
    return;
  }

  const { sessionCount: currentSessionCount } = snapshot.val() as ActiveUser;

  if (sessionCountBeforeRemoval === currentSessionCount) {
    await remove(getActiveUserRef(uid));

    return;
  }

  const sessionCount = currentSessionCount - sessionCountIncrement;

  await update(getActiveUserRef(uid), { sessionCount });
};

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

  const { uid, displayName } = user.user;

  const isOnline = await isUserActive(uid);

  let sessionCount = 1;

  if (isOnline) {
    const snapshot = await findActiveUser(uid);
    const { sessionCount: currentSessionCount } = snapshot.val() as ActiveUser;
    sessionCount = currentSessionCount + sessionCountIncrement;

    await update(getActiveUserRef(uid), { sessionCount });
  } else {
    await setUserAsActive({
      [uid]: {
        displayName,
        sessionCount,
      },
    });
  }

  await createSessionCookie(uid);

  return user;
};

export const signOut = async (): Promise<void> => {
  if (auth.currentUser) {
    await setUserAsInactive(auth.currentUser.uid);
  }

  try {
    await auth.signOut();

    await deleteSessionCookie();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
};
