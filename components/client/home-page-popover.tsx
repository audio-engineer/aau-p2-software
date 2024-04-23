"use client";

import type {
  FC,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";

interface HomePagePopoverProps {
  readonly icon: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const HomePagePopover: FC<PropsWithChildren<HomePagePopoverProps>> = ({
  icon,
  children,
}: PropsWithChildren<HomePagePopoverProps>): ReactElement | null => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick} size="large">
        <SvgIcon>{icon}</SvgIcon>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box maxWidth={400}>
          <Typography sx={{ p: 2 }} align="center">
            {children}
          </Typography>
        </Box>
      </Popover>
    </div>
  );
};

export default HomePagePopover;
