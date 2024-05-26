import type { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import AboutCard from "@/components/server/about-card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const AboutPage: FC = (): ReactElement | null => {
  return (
    <Box display="flex" flexDirection="column">
      <Typography
        variant="h3"
        align="center"
        display={{ xs: "initial", md: "none" }}
      >
        About Us
      </Typography>
      <Typography
        variant="h2"
        align="center"
        display={{ xs: "none", md: "initial" }}
      >
        About Us
      </Typography>
      <Typography variant="body1" sx={{ paddingBottom: 4 }} textAlign="center">
        ChessTeacher is a semester project created by the group of computer
        science students seen below. The project was created to understand how a
        chess web app could be created, and to experiment with teaching
        methodology. To enhance the teaching process, they combined the power of
        chess engines with the social experience of player-versus-player
        gameplay.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <AboutCard imageName="sebastian.jpg" name="Sebastian Mygind">
          Sebastian Mygind, a 21-year-old computer science student at Aalborg
          University Copenhagen, is one of the creators behind the ChessTeacher
          chess web-app.
        </AboutCard>
        <AboutCard imageName="simon.jpg" name="Simon Woidmann">
          Simon Woidemann, a 20-year-old computer science student at Aalborg
          University Copenhagen, is one of the creators behind the ChessTeacher
          chess web-app.
        </AboutCard>
        <AboutCard imageName="default_picture.jpg" name="Martin Kedmenec">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          venenatis ex magna, eget viverra sem viverra et. Pellentesque nec
          porttitor sapien.
        </AboutCard>
        <AboutCard imageName="mads.jpg" name="Mads Heilmann">
          Meet Mads Heilmann, a 23-year-old computer science student at AAU.
          Enhancing the ChessTeacher project with his creative touch, he is
          crafting a captivating multiplayer experience for effortless chess
          learning.
        </AboutCard>
        <AboutCard imageName="kristiyan.jpg" name="Kristiyan Mariyan Georgiev">
          Kristiyan is a 20-year-old student with interest in anything but
          chess. But because he likes tackling new challenges and learning new
          things, he decided to join the ChessTeacher project.
        </AboutCard>
      </Grid>
    </Box>
  );
};

export default AboutPage;
