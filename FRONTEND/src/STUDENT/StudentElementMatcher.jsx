import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import './StudentElementMatcher.css'; // Import the CSS file

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// Element data - can be expanded with more properties
const elementPairs = [
  { id: 1, symbol: "H", name: "Hydrogen", matched: false },
  { id: 2, symbol: "He", name: "Helium", matched: false },
  { id: 3, symbol: "Li", name: "Lithium", matched: false },
  { id: 4, symbol: "Be", name: "Beryllium", matched: false },
  { id: 5, symbol: "B", name: "Boron", matched: false },
  { id: 6, symbol: "C", name: "Carbon", matched: false },
  { id: 7, symbol: "N", name: "Nitrogen", matched: false },
  { id: 8, symbol: "O", name: "Oxygen", matched: false },
];

const StudentElementMatcher = () => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  

  // Shuffle cards
  const shuffleCards = () => {
    // Create card pairs - one for symbol, one for name
    const cardPairs = [...elementPairs].flatMap(element => ([
      { id: element.id, type: 'symbol', content: element.symbol, matched: false },
      { id: element.id, type: 'name', content: element.name, matched: false }
    ]));
    
    // Shuffle the cards
    const shuffled = [...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, cardId: Math.random() }));

    setCards(shuffled);
    setTurns(0);
    setScore(0);
    setFirstChoice(null);
    setSecondChoice(null);
    setGameOver(false);
    setFeedback("");
  };

  // Handle card choice
  const handleChoice = (card) => {
    if (disabled) return;
    
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  // Start a new game automatically when component mounts
  useEffect(() => {
    shuffleCards();
  }, []);

  // Compare the two selected cards
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      
      if (firstChoice.id === secondChoice.id && firstChoice.type !== secondChoice.type) {
        // Found a match!
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.id === firstChoice.id) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setScore(prevScore => prevScore + 100);
        setFeedback("✅ Match found!");
        resetTurn();
      } else {
        setFeedback("❌ Not a match!");
        // Wait before flipping cards back
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // Check if game is over (all matches found)
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameOver(true);
      setFeedback("🎉 You completed the game!");
    }
  }, [cards]);

  // Reset choices and increase turn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
    
    // Clear feedback after a short delay
    setTimeout(() => {
      setFeedback("");
    }, 1000);
  };

  return (
    <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "#0a0a0f",
        height: "100vh",
        width: "100%",
      }}>
      <Box 
        component="main"
        className={`main-container ${open ? 'main-container-open' : 'main-container-closed'}`}
      >
        <Box className="game-container">
          <Box className="header-section">
            <Typography variant="h4" className="game-title">
              Element Memory Match
            </Typography>
            <Box className="stats-container">
              <Typography variant="h6" className="score-display">
                Score: {score}
              </Typography>
              <Typography variant="h6" className="turns-display">
                Turns: {turns}
              </Typography>
            </Box>
          </Box>

          {/* Game instructions */}
          <Box className="instruction-panel">
            <Typography variant="body1">
              Match element symbols with their names. Click on cards to flip them and find matching pairs!
            </Typography>
          </Box>

          {/* Feedback message */}
          {feedback && (
            <Typography variant="h6" className="feedback">
              {feedback}
            </Typography>
          )}

          {/* Card grid */}
          <Box className="card-grid">
            {cards.map(card => (
              <Box
                key={card.cardId}
                className={`memory-card ${
                  card.matched ? 'matched' :
                  card === firstChoice || card === secondChoice ? 'flipped' : ''
                }`}
                onClick={() => !card.matched && card !== firstChoice && card !== secondChoice && handleChoice(card)}
              >
                <Box className="card-inner">
                  <Box className="card-front">
                    <Typography variant="h5" className="card-content">
                      ?
                    </Typography>
                  </Box>
                  <Box className="card-back">
                    <Typography variant="h5" className="card-content">
                      {card.content}
                    </Typography>
                    <Typography variant="caption" className="card-type">
                      {card.type === 'symbol' ? 'Symbol' : 'Name'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* New game button */}
          <Button 
            variant="contained" 
            onClick={shuffleCards} 
            className="new-game-btn"
            disabled={disabled && !gameOver}
          >
            New Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentElementMatcher;