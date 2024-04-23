import type { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import HomePagePopover from "@/components/client/home-page-popover";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";
import ComputerIcon from "@mui/icons-material/Computer";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import CropSquareIcon from "@mui/icons-material/CropSquare";

const HomePage: FC = (): ReactElement | null => {
  return (
    <Grid container direction="column" spacing={8}>
      <Grid>
        <Typography variant="h1" align="center">
          Welcome to ChessTeacher
        </Typography>
        <Typography variant="subtitle1" align="center">
          The app for multiplayer chess learning.
        </Typography>
        <Typography variant="subtitle2" align="center">
          Explore the concept by clicking the buttons below.
        </Typography>
      </Grid>
      <Grid container direction="column" spacing={8}>
        <Grid container justifyContent="center">
          <Grid>
            <HomePagePopover icon={<ComputerIcon />}>
              The Stockfish automated teacher applies pedagogical methods as an
              actual physical teacher would to teach the players by analysing
              their moves and providing instant feedback.
            </HomePagePopover>
          </Grid>
          <Grid>
            <HomePagePopover icon={<SchoolIcon />}>
              Elements from the traditional physical teacher, such as
              pedagogical methods, is programmed into the Stockfish automated
              teacher.
            </HomePagePopover>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid>
            <HomePagePopover icon={<PersonIcon />}>
              Player 1 is contented to a lobby that serves them the chat and the
              game.
            </HomePagePopover>
          </Grid>
          <Grid>
            <HomePagePopover icon={<StorageIcon />}>
              The lobby is the top level connection between the players and the
              game. It is also the entity that the players join.
            </HomePagePopover>
          </Grid>
          <Grid>
            <HomePagePopover icon={<PersonIcon />}>
              Player 2 is contented to a lobby that serves them the chat and the
              game.
            </HomePagePopover>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid>
            <HomePagePopover icon={<ChatIcon />}>
              The chat is where the Stockfish automated teacher communicates
              with the players. It is also a medium for the players to
              communicate with each other.
            </HomePagePopover>
          </Grid>
          <Grid>
            <HomePagePopover icon={<CropSquareIcon />}>
              The chessboard is online which provides the players access to the
              game of chess on demand.
            </HomePagePopover>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomePage;
