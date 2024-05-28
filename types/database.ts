import type { User } from "firebase/auth";
import type { Color } from "chess.js";

export enum PlayerNumber {
  playerOne = 1,
  playerTwo = 2,
}

export interface MatchPlayerInfo extends Pick<User, "displayName"> {
  readonly color: Color;
  readonly playerNumber: PlayerNumber;
}

export type MatchPlayerRecord = Readonly<Record<User["uid"], MatchPlayerInfo>>;

export interface State {
  readonly fen: string | false;
}

export interface Match {
  readonly state: State;
  readonly players: MatchPlayerRecord;
}

export type MatchId = Readonly<string>;

export type MatchRecord = Readonly<Record<MatchId, Match>>;
