import { initializeApp } from "firebase/app";
import type { DatabaseReference } from "firebase/database";
import { connectDatabaseEmulator, getDatabase, ref } from "firebase/database";
import type { User } from "firebase/auth";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import type { MatchId } from "@/types/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const getMatchesRef = (): DatabaseReference => ref(database, "matches");

export const getMatchPlayersRef = (mid: MatchId): DatabaseReference =>
  ref(database, `matches/${mid}/players`);

export const getMatchPlayerRef = (
  mid: MatchId,
  uid: User["uid"],
): DatabaseReference => ref(database, `matches/${mid}/players/${uid}`);

export const getMatchStateRef = (mid: MatchId): DatabaseReference =>
  ref(database, `matches/${mid}/state`);

export const getMessagesRef = (mid: MatchId): DatabaseReference =>
  ref(database, `messages/${mid}`);

if ("production" !== process.env.NODE_ENV) {
  connectDatabaseEmulator(
    database,
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_HOST ?? "localhost",
    parseInt(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_PORT ?? "9000"),
  );

  connectAuthEmulator(
    auth,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ??
      "http://localhost:9099",
  );
}
