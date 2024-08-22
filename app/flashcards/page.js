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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { collection, getDocs, doc } from "firebase/firestore";

export default function ViewFlashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardsByDeck, setFlashcardsByDeck] = useState({});
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
      let flashcardsByDeck = {};
  
      querySnapshot.forEach((doc) => {
        const flashcardsData = doc.data();
        Object.entries(flashcardsData).forEach(([deckName, deck]) => {
          if (Array.isArray(deck)) {
            flashcardsByDeck[deckName] = deck;
          }
        });
      });
  
      setFlashcardsByDeck(flashcardsByDeck);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleCardClick = (deckName, index) => {
    setFlipped((prev) => ({
      ...prev,
      [`${deckName}-${index}`]: !prev[`${deckName}-${index}`],
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
        {Object.keys(flashcardsByDeck).length > 0 ? (
          Object.entries(flashcardsByDeck).map(([deckName, flashcards]) => (
            <Accordion key={deckName} sx={{ width: "100%", mt: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${deckName}-content`}
                id={`${deckName}-header`}
              >
                <Typography variant="h6">{deckName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card>
                        <CardContent
                          onClick={() => handleCardClick(deckName, index)}
                          sx={{
                            perspective: "1000px",
                            "& > div": {
                              transition: "transform 0.6s",
                              transformStyle: "preserve-3d",
                              position: "relative",
                              width: "100%",
                              height: "200px",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                              transform: flipped[`${deckName}-${index}`]
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
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4 }}>
            No flashcards found.
          </Typography>
        )}
      </Box>
    </Container>
  );
}