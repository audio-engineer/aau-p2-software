"use client";

import type { FC, ReactElement } from "react";
import { useContext } from "react";
import { redirect } from "next/navigation";
import AuthenticationContext from "@/app/authentication-context";
import MatchPage from "@/components/match-page";
import Loader from "@/components/loader";
import type { MatchId } from "@/types/database";

interface MatchProps {
  readonly params: {
    readonly mid: MatchId;
  };
}

const Match: FC<MatchProps> = ({ params }: MatchProps): ReactElement | null => {
  const { isLoading, user } = useContext(AuthenticationContext);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    redirect("/");
  }

  return <MatchPage user={user} mid={params.mid} />;
};

export default Match;
