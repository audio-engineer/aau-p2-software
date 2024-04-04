import type { FC, ReactElement } from "react";
import Paper from "@mui/material/Paper";

const AboutPage: FC = (): ReactElement | null => {
  return (
    <Paper sx={{ display: "flex", height: "80%", width: "50%", p: 4 }}>
      This web application was written as a university project
    </Paper>
  );
};

export default AboutPage;
