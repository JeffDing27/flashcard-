"use client";

import { db } from "../../firebase";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Call your actual /api/generate endpoint
  const handleGenerate = async () => {
  console.log("Generate button clicked!");
  if (!text.trim()) return;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: text }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error("Generate API network response was not ok");
    }

    const data = await response.json();
    console.log("API Response data:", data);

    if (data?.output) {
      setFlashcards(data.output); // set generated flashcards
    } else {
      setFlashcards([]);
      alert("No flashcards generated");
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
  }
};


  // Save function
  const saveFlashcards = async (deckName, cards) => {
    if (!user?.id) {
      alert("User not signed in");
      return;
    }

    if (!deckName) {
      alert("Please enter a deck name");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.id); // user doc
      const flashcardsCollectionRef = collection(userDocRef, "flashcards"); // subcollection
      const deckDocRef = doc(flashcardsCollectionRef); // new document

      await setDoc(deckDocRef, { [deckName]: cards });

      alert("Flashcards saved successfully!");
      setOpen(false);
      router.push("/flashcards");
    } catch (err) {
      console.error("Error saving flashcards:", err);
      alert("Failed to save flashcards");
    }
  };

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  return (
    <Container maxWidth="md">
      <SignedIn>
        <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4">Generate Flashcards</Typography>

          <Paper sx={{ p: 4, width: "100%", mt: 2 }}>
            <TextField
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerate} fullWidth>
              Generate
            </Button>
          </Paper>

          {flashcards.length > 0 && (
            <Box sx={{ mt: 4, width: "100%" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Flashcards Preview</Typography>
              <Grid container spacing={3}>
                {flashcards.map((card, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1">{card.front}</Typography>
                        <Typography variant="body2">{card.back}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
                  Save Flashcards
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Dialog to enter deck name */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter a name for your flashcard deck:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Deck Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => saveFlashcards(name, flashcards)}>Save</Button>
          </DialogActions>
        </Dialog>
      </SignedIn>

      <SignedOut>
        <Box sx={{ mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4">Please log in to generate flashcards</Typography>
        </Box>
      </SignedOut>
    </Container>
  );
}
