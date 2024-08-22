"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

export default function ViewFlashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchFlashcards();
    }
  }, [isLoaded, isSignedIn]);

  const fetchFlashcards = async () => {
    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const flashcardsCollectionRef = collection(userDocRef, "flashcards");
      const querySnapshot = await getDocs(flashcardsCollectionRef);
      let allFlashcards = [];
  
      querySnapshot.forEach((doc) => {
        const flashcardsData = doc.data();
        Object.values(flashcardsData).forEach((deck) => {
          if (Array.isArray(deck)) {
            allFlashcards = [...allFlashcards, ...deck];
          }
        });
      });
  
      setFlashcards(allFlashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">View Flashcards</Typography>
        {flashcards.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent
                    onClick={() => handleCardClick(index)}
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ mt: 4 }}>
            No flashcards found.
          </Typography>
        )}
      </Box>
    </Container>
  );
}