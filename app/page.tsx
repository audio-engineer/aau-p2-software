"use client";

import type { FC, ReactElement } from "react";
import { SignInButton } from "@/components/buttons";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

const Home: FC = (): ReactElement | null => {
  const [user] = useAuthState(auth);

  return (
    <main className="flex min-h-screen items-center justify-around">
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">ChessTeacher</Link>
          </Typography>
          {user && (
            <>
              <Button color="inherit">
                <Link href={"/chess"}>Chess</Link>
              </Button>
              <Button color="inherit">
                <Link href={"/account"}>Account</Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SignInButton />
    </main>
  );
};

export default Home;
