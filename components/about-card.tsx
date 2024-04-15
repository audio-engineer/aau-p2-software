import type { FC, ReactElement } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from "@mui/material";

const CARD_WIDTH = 300;
const CARD_LENGTH = 300;

interface AboutUsProps {
  readonly image_path: string | undefined;
  readonly name: string;
  readonly description: string;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const AboutCard: FC<AboutUsProps> = ({
  image_path,
  name,
  description,
}: AboutUsProps): ReactElement | null => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let image: string;
  const ALT_TEXT = `picture of ${name}`;

  if (null == image_path) {
    image = "images/default_profile.jpg";
  } else {
    image = image_path;
  }

  return (
    <Card sx = {{ maxWidth: CARD_WIDTH }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={CARD_LENGTH}
          image={image}
          alt={ALT_TEXT}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
};

export default AboutCard;
