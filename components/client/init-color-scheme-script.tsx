"use client";

import { getInitColorSchemeScript } from "@mui/material/styles";
import type { FC, ReactElement } from "react";

const InitColorSchemeScript: FC = (): ReactElement | null =>
  getInitColorSchemeScript() as ReactElement | null;

export default InitColorSchemeScript;
