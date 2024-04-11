import type { ReactNode, FC, MouseEvent } from "react";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface PopoverProps {
  readonly buttonContent: ReactNode;
  readonly popoverContent: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const HomePagePopover: FC<PopoverProps> = ({
  buttonContent,
  popoverContent,
}: PopoverProps) => {
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
        {buttonContent}
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
            {popoverContent}
          </Typography>
        </Box>
      </Popover>
    </div>
  );
};
