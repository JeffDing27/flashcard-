import { SignIn } from "@clerk/nextjs";
import Link from "next/link"; // Import Link from next/link
import { Toolbar, Typography, AppBar, Button, Box, Container } from "@mui/material";

export default function SignInPage() {
  return (
    <Container maxWidth="100vw">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
            }}
          >
            Flashcard Saas{" "}
          </Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
              Log in
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
              Sign up
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

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
