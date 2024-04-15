import type { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import AboutCard from "@/components/about-card";
import Grid from "@mui/material/Unstable_Grid2";

const AboutPage: FC = (): ReactElement | null => {
  return (
    <Grid>
      <Typography variant="h1" align="center">
        About Us
      </Typography>
      <AboutCard
        image_path="images/default_profile.jpg"
        name="Sebastian Mygind"
        description="
        Sebastian was one of the founders of this here
        revolutionary educational chess game, one might think he is god."
      />
    </Grid>
  );
};

export default AboutPage;
