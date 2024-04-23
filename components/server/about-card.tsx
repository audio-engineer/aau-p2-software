import type { FC, PropsWithChildren, ReactElement } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

interface AboutCardProps {
  readonly imageName: string;
  readonly name: string;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const AboutCard: FC<PropsWithChildren<AboutCardProps>> = ({
  imageName,
  name,
  children,
}: PropsWithChildren<AboutCardProps>): ReactElement | null => {
  return (
    <Grid item>
      <Card sx={{ width: 250, boxShadow: 1 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height={200}
            image={`/images/${imageName}`}
            alt={`picture of ${name}`}
          />
          <CardContent sx={{ height: 200 }}>
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {children}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default AboutCard;
