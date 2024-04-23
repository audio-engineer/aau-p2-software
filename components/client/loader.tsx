"use client";

import CircularProgress from "@mui/material/CircularProgress";
import type { FC, ReactElement } from "react";

const Loader: FC = (): ReactElement | null => {
  return <CircularProgress sx={{ alignSelf: "center", margin: "auto" }} />;
};

export default Loader;
