"use client";

import type { FC, ReactElement } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import { useAuthentication } from "@/contexts/authentication";
import Loader from "@/components/client/loader";

const firstCharPos = 0;

const AccountPage: FC = (): ReactElement | null => {
  const { isUserLoading, user } = useAuthentication();

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <>
      <Paper elevation={3} square={false} sx={{ mb: "2rem" }}>
        <Box
          p={4}
          gap={4}
          sx={{
            border: "2px solid grey",
          }}
          mb={4}
        >
          <Typography
            variant={"h5"}
            gutterBottom={true}
            sx={{ marginBottom: 2, marginTop: 0 }}
          >
            Public Profile
          </Typography>
          <Box display={"flex"} alignItems={"center"} gap={4}>
            <Avatar
              alt={user?.displayName ?? ""}
              src={user?.photoURL ?? ""}
              sx={{ height: 96, width: 96 }}
            >
              {user?.displayName?.charAt(firstCharPos)}
            </Avatar>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant={"subtitle1"} sx={{ marginLeft: 2 }}>
                Username:
              </Typography>
              <Typography variant={"h5"} sx={{ marginLeft: 2 }}>
                {user?.displayName}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={3} square={false}>
        <Box
          p={8}
          gap={4}
          sx={{
            border: "2px solid grey",
          }}
          mb={4}
        >
          <Typography variant="h5" mb={3}>
            Account Information
          </Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={user?.displayName ?? ""}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <LockIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={user?.email ?? ""}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <LockIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default AccountPage;
