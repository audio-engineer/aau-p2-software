"use client";

import { Chessboard } from "react-chessboard";
import type { FC } from "react";
import Hello from "@/app/hello";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Home: FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-around">
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AAU P2 Software
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Chessboard id="chessboard" boardWidth={560} />
      <Hello text={"World"} age={27} />
    </main>
  );
};

Home.displayName = "Home";

export default Home;
