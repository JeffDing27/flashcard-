import { SignUp } from "@clerk/nextjs";
import { Typography, Box, Container } from "@mui/material";

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4">Sign Up</Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
