import { SignIn } from "@clerk/nextjs";
import { Typography, Box, Container } from "@mui/material";

export default function SignInPage() {
  return (
    <Container maxWidth="100vw">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4">Sign In</Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
