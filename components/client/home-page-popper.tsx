"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type {
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  MouseEvent,
} from "react";
import SvgIcon from "@mui/material/SvgIcon";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";

interface HomePagePopperProps {
  readonly icon: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const HomePagePopper: FC<PropsWithChildren<HomePagePopperProps>> = ({
  icon,
  children,
}: PropsWithChildren<HomePagePopperProps>): ReactElement | null => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClickAway = (): void => {
    setAnchorEl(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }} m={2}>
        <Button onClick={handleClick} variant="contained" size="large">
          <SvgIcon>{icon}</SvgIcon>
        </Button>
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl}>
          <Paper sx={{ maxWidth: 400 }}>
            <Typography sx={{ p: 2 }} align="center">
              {children}
            </Typography>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default HomePagePopper;
