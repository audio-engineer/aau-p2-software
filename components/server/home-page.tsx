import type { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import StorageIcon from "@mui/icons-material/Storage";
import ComputerIcon from "@mui/icons-material/Computer";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import Box from "@mui/material/Box";
import HomePagePopper from "@/components/client/home-page-popper";

const HomePage: FC = (): ReactElement | null => {
  return (
    <>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="h3"
          align="center"
          display={{ xs: "initial", md: "none" }}
        >
          Welcome to ChessTeacher
        </Typography>
        <Typography
          variant="h1"
          align="center"
          display={{ xs: "none", md: "initial" }}
        >
          Welcome to ChessTeacher
        </Typography>
        <Typography variant="subtitle1" align="center">
          The app for multiplayer chess learning.
        </Typography>
        <Typography variant="subtitle2" align="center">
          Explore the concept by clicking the buttons below.
        </Typography>
      </Box>
      <Box>
        <Box display="flex" justifyContent="center">
          <HomePagePopper icon={<ComputerIcon />}>
            The Stockfish automated teacher applies pedagogical methods as an
            actual physical teacher would to teach the players by analysing
            their moves and providing instant feedback.
          </HomePagePopper>
          <HomePagePopper icon={<SchoolIcon />}>
            Elements from the traditional physical teacher, such as pedagogical
            methods, is programmed into the Stockfish automated teacher.
          </HomePagePopper>
        </Box>
        <Box display="flex" justifyContent="center">
          <HomePagePopper icon={<PersonIcon />}>
            Player 1 is contented to a lobby that serves them the chat and the
            game.
          </HomePagePopper>
          <HomePagePopper icon={<StorageIcon />}>
            The lobby is the top level connection between the players and the
            game. It is also the entity that the players join.
          </HomePagePopper>
          <HomePagePopper icon={<PersonIcon />}>
            Player 2 is contented to a lobby that serves them the chat and the
            game.
          </HomePagePopper>
        </Box>
        <Box display="flex" justifyContent="center">
          <HomePagePopper icon={<ChatIcon />}>
            The chat is where the Stockfish automated teacher communicates with
            the players. It is also a medium for the players to communicate with
            each other.
          </HomePagePopper>
          <HomePagePopper icon={<CropSquareIcon />}>
            The chessboard is online which provides the players access to the
            game of chess on demand.
          </HomePagePopper>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
