import type { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import AboutCard from "@/components/about-card";
import Grid from "@mui/material/Grid";

const AboutPage: FC = (): ReactElement | null => {
  return (
    <Grid container direction="column">
      <Typography variant="h1" align="center">
        About Us
      </Typography>
      <Typography variant="h6" sx={{ paddingBottom: 4 }} textAlign="center">
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
        <AboutCard imageName="default_picture.jpg" name="Simon Woidmann">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          venenatis ex magna, eget viverra sem viverra et. Pellentesque nec
          porttitor sapien.
        </AboutCard>
        <AboutCard imageName="default_picture.jpg" name="Martin Kedmenec">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          venenatis ex magna, eget viverra sem viverra et. Pellentesque nec
          porttitor sapien.
        </AboutCard>
        <AboutCard imageName="default_picture.jpg" name="Mads Heilmann">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          venenatis ex magna, eget viverra sem viverra et. Pellentesque nec
          porttitor sapien.
        </AboutCard>
        <AboutCard
          imageName="default_picture.jpg"
          name="Kristiyan Mariyan Georgiev"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          venenatis ex magna, eget viverra sem viverra et. Pellentesque nec
          porttitor sapien.
        </AboutCard>
      </Grid>
    </Grid>
  );
};

export default AboutPage;
