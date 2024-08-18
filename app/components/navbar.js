import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <Container maxWidth="100vw" disableGutters>
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
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
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
          </SignedOut>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
