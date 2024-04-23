"use client";

import type { FC, ReactElement } from "react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowsProp,
} from "@mui/x-data-grid";
import { useAuthentication } from "@/contexts/authentication";
import type { MatchId, MatchPlayerInfo, MatchRecord } from "@/types/database";
import { type Match, PlayerNumber } from "@/types/database";
import {
  type DataSnapshot,
  onChildChanged,
  onValue,
  set,
} from "firebase/database";
import { getMatchesRef, getMatchPlayerRef } from "@/firebase/firebase";
import type { User } from "@firebase/auth";
import type { SessionUser } from "@/types/session";
import { findPlayerUidByPlayerNumber } from "@/utils/utils";
import type { Color } from "chess.js";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Loader from "@/components/client/loader";

type MatchRowPlayerData = MatchPlayerInfo & {
  readonly displayName: User["displayName"];
};

interface MatchRowModel {
  readonly id: MatchId;
  readonly playerOne: MatchRowPlayerData | undefined;
  readonly playerTwo: MatchRowPlayerData | undefined;
}

const getMatchRowPlayerData = (
  matchRecord: MatchRecord,
  key: string,
  uid: SessionUser["uid"] | undefined,
): MatchRowPlayerData | undefined => {
  if (undefined === uid) {
    return undefined;
  }

  const player = matchRecord[key].players[uid];

  return {
    displayName: player.displayName,
    color: player.color,
    playerNumber: player.playerNumber,
  };
};

const getMatchRowModelArray = (matchRecord: MatchRecord): MatchRowModel[] => {
  return Object.keys(matchRecord).map((key) => {
    const matchPlayerRecord = matchRecord[key].players;

    const playerOneUid = findPlayerUidByPlayerNumber(
      matchPlayerRecord,
      PlayerNumber.playerOne,
    );
    const playerTwoUid = findPlayerUidByPlayerNumber(
      matchPlayerRecord,
      PlayerNumber.playerTwo,
    );

    return {
      id: key,
      playerOne: getMatchRowPlayerData(matchRecord, key, playerOneUid),
      playerTwo: getMatchRowPlayerData(matchRecord, key, playerTwoUid),
    };
  });
};

const joinMatch = async (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): Promise<void> => {
  let color: Color = "w";

  if ("w" === params.row.playerOne?.color) {
    color = "b";
  }

  await set(getMatchPlayerRef(params.row.id, user.uid), {
    color,
    displayName: user.displayName,
    playerNumber: 2,
  } satisfies MatchPlayerInfo);
};

const joinMatchHandler = (
  params: GridRenderCellParams<MatchRowModel>,
  user: User,
): void => {
  joinMatch(params, user).catch((error: unknown) => {
    console.error(error);
  });
};

const displayToast = (matchSnapshot: DataSnapshot, uid: User["uid"]): void => {
  const match = matchSnapshot.val() as Match;

  if (!Object.keys(match.players).includes(uid)) {
    return;
  }

  const opponentUid = Object.keys(match.players).find((id) => id !== uid);

  if (undefined === opponentUid) {
    return;
  }

  if (PlayerNumber.playerTwo !== match.players[opponentUid].playerNumber) {
    return;
  }

  const opponentDisplayName = match.players[opponentUid].displayName ?? "";

  toast(
    `♟️ Player ${opponentDisplayName} joined your match ${matchSnapshot.key}!`,
  );
};

const columns = (user: User): GridColDef[] => [
  { field: "id", headerName: "Match ID", flex: 1 },
  {
    field: "playerOne",
    headerName: "Player 1",
    flex: 1,
    valueGetter: (value: MatchRowPlayerData): string => {
      return `${value.displayName} (${value.color})`;
    },
  },
  {
    field: "playerTwo",
    headerName: "Player 2",
    flex: 1,
    valueGetter: (value: MatchRowPlayerData | undefined): string => {
      if (!value) {
        return "-";
      }

      return `${value.displayName} (${value.color})`;
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params: GridRenderCellParams<MatchRowModel>): ReactNode => {
      if (
        undefined === params.row.playerTwo &&
        user.displayName !== params.row.playerOne?.displayName
      ) {
        return (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              joinMatchHandler(params, user);
            }}
          >
            Join
          </Button>
        );
      }

      return (
        <Button variant="contained" href={`/match/${params.row.id}`}>
          View
        </Button>
      );
    },
  },
];

const LobbyGrid: FC = (): ReactElement | null => {
  const { isUserLoading, user } = useAuthentication();

  const [matches, setMatches] = useState<MatchRecord>();

  useEffect(() => {
    return onValue(getMatchesRef(), (matchesSnapshot) => {
      if (!matchesSnapshot.exists()) {
        return;
      }

      setMatches(matchesSnapshot.val() as MatchRecord);
    });
  }, []);

  useEffect(() => {
    return onChildChanged(getMatchesRef(), (matchSnapshot) => {
      if (!matchSnapshot.exists()) {
        return;
      }

      displayToast(matchSnapshot, user?.uid ?? "");
    });
  }, [user?.uid]);

  const rows: GridRowsProp = useMemo(() => {
    if (!matches) {
      return [];
    }

    return getMatchRowModelArray(matches);
  }, [matches]);

  if (isUserLoading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <DataGrid rows={rows} columns={columns(user)} disableRowSelectionOnClick />
  );
};

export default LobbyGrid;
