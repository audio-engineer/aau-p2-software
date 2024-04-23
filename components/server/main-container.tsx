import type { FC, PropsWithChildren, ReactElement } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Navigation from "@/components/server/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const MainContainer: FC<PropsWithChildren> = ({
  children,
}: Readonly<PropsWithChildren>): ReactElement | null => {
  return (
    <Box>
      <Navigation />
      <Box
        component="main"
        display="flex"
        height="calc(100vh - 64px)"
        maxHeight="1200px"
      >
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            height="100%"
            sx={{ py: 2 }}
          >
            {children}
          </Box>
        </Container>
        <ToastContainer position="bottom-right" />
      </Box>
    </Box>
  );
};

export default MainContainer;
