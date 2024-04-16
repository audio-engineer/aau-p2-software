import type { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, getActiveUserRef } from "@/firebase/firebase";
import type { DataSnapshot } from "firebase/database";
import { get, remove, set, update } from "firebase/database";
import type { ActiveUser, ActiveUserRecord } from "@/types/database";

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

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();

  try {
    const user = await signInWithPopup(auth, provider);

    const { uid, displayName } = user.user;

    const isOnline = await isUserActive(uid);

    let sessionCount = 1;

    if (isOnline) {
      const snapshot = await findActiveUser(uid);
      const { sessionCount: currentSessionCount } =
        snapshot.val() as ActiveUser;
      sessionCount = currentSessionCount + sessionCountIncrement;

      await update(getActiveUserRef(uid), { sessionCount });

      return null;
    }

    await setUserAsActive({
      [uid]: {
        displayName,
        sessionCount,
      },
    });
  } catch (error) {
    console.error("Error signing in with Google", error);
  }

  return null;
};

export const signOut = async (): Promise<void> => {
  if (auth.currentUser) {
    await setUserAsInactive(auth.currentUser.uid);
  }

  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
};
