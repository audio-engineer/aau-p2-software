import type { User } from "@firebase/auth";
import type { Color, Move } from "chess.js";

export type MatchId = string;

export type BaseActiveUser = Pick<User, "displayName">;

export interface ActiveUser extends BaseActiveUser {
  readonly sessionCount: number;
}

export type ActiveUserRecord = Readonly<Record<User["uid"], ActiveUser>>;

export interface BasePlayerMatchInfo {
  readonly color: Color;
}

export interface PlayerOneMatchInfo extends BasePlayerMatchInfo {
  readonly playerOne: boolean;
  readonly playerTwo: never;
}

export interface PlayerTwoMatchInfo extends BasePlayerMatchInfo {
  readonly playerOne: never;
  readonly playerTwo: boolean;
}

export type PlayerMatchInfo = PlayerOneMatchInfo | PlayerTwoMatchInfo;

export type MatchPlayerRecord = Readonly<Record<User["uid"], PlayerMatchInfo>>;

export interface Match {
  readonly fen: string;
  readonly latestMove: Move;
  readonly players: MatchPlayerRecord;
}

export type MatchRecord = Readonly<Record<MatchId, Match>>;
