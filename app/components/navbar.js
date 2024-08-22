import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link as MuiLink,
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
            <MuiLink component={Link} href="/" color="inherit" underline="none">
              Flashcard Buddy
            </MuiLink>
          </Typography>
          <SignedIn>
            <Button color="inherit" sx={{ marginRight: '16px' }}>
              <MuiLink component={Link} href="/generate" color="inherit" underline="none">
                Create
              </MuiLink>
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button color="inherit">
              <MuiLink component={Link} href="/sign-in" color="inherit" underline="none">
                Log in
              </MuiLink>
            </Button>
            <Button color="inherit">
              <MuiLink component={Link} href="/sign-up" color="inherit" underline="none">
                Sign up
              </MuiLink>
            </Button>
          </SignedOut>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
