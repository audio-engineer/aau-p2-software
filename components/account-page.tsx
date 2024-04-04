import type { FC, ReactElement } from "react";
import type { User } from "@firebase/auth";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface AccountPageProps {
  readonly user: User | null;
}

const AccountPage: FC<AccountPageProps> = ({
  user,
}: AccountPageProps): ReactElement | null => {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
        width: "60%",
        p: 4,
      }}
    >
      <Typography variant="h5">Name: {user?.displayName}</Typography>
      <Typography variant="h5">Email: {user?.email}</Typography>
    </Paper>
  );
};

export default AccountPage;
