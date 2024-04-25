import type { FC, ReactElement } from "react";
import MatchPage from "@/components/server/match-page";
import type { MatchId } from "@/types/database";
import { verifySession } from "@/utils/server-actions";
import MatchProvider from "@/components/client/providers/match-provider";
import { redirect } from "next/navigation";

interface MatchProps {
  readonly params: {
    readonly mid: MatchId;
  };
}

const Match: FC<MatchProps> = async ({
  params,
}: MatchProps): Promise<ReactElement | null> => {
  const session = await verifySession();

  if (!session) {
    redirect("/");
  }

  return (
    <MatchProvider mid={params.mid}>
      <MatchPage />
    </MatchProvider>
  );
};

export default Match;
