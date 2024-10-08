import {
  faCheckCircle,
  faClock,
  faDoorOpen,
  faQuestionCircle,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import he from "he";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { fadeIn } from "react-animations";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`${fadeIn}`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  padding: 2rem;
  animation: ${fadeInAnimation} 0.5s;
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  background-color: #6e8efb;
  color: white;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Question = styled.h2`
  color: #4a4a4a;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Timer = styled.p`
  color: #6a6a6a;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const TableHeader = styled.th`
  background-color: #6e8efb;
  color: white;
  padding: 0.8rem;
  text-align: left;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
`;

const TableCell = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
  }
`;

function StartQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerResult, setPlayerResult] = useState(null);
  const { roomId } = useParams();
  const token = localStorage.getItem("token");
  const timerIdRef = useRef(null);

  const startTimer = () => {
    const timer = setInterval(() => {
      setTotalTime((prevTime) => prevTime + 1);
    }, 1000);
    timerIdRef.current = timer;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/game/${roomId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setQuestions(response.data.questions);
        setQuestionsLoaded(true);
        startTimer();
      })
      .catch((error) => {
        console.error(error);
      });

    return () => clearInterval(timerIdRef.current);
  }, [roomId, token]);

  useEffect(() => {
    if (questionsLoaded) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setIsGameFinished(true);
        }
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questionsLoaded, questions.length]);

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const userId = jwtDecode(token).id;
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedOption === currentQuestion.correctOption;
      const startTime = totalTime;

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/game/submit`,
        {
          roomId,
          userId,
          questionIndex: currentQuestionIndex,
          selectedOption,
          startTime,
          isCorrect,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPlayerResult(response.data.playerResult);
        setLeaderboard(response.data.leaderboard);
        alert(isCorrect ? "Correct Answer!" : "Incorrect Answer!");

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setIsGameFinished(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setSelectedOption(null);
    }
  };

  const handleEndGame = useCallback(async () => {
    try {
      const userId = jwtDecode(token).id;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/game/end`,
        { roomId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success || response.data.game.status === "ended") {
        alert("The game has been successfully ended.");
      } else {
        alert("Failed to end the game. Please try again.");
      }
    } catch (error) {
      console.error("Error ending the game:", error);
    }
  }, [roomId, token]);

  useEffect(() => {
    if (isGameFinished) {
      handleEndGame();
    }
  }, [isGameFinished, handleEndGame]);

  if (isGameFinished) {
    return (
      <PageContainer className="mt-5">
        <Card>
          <CardHeader>
            <Title>
              <FontAwesomeIcon icon={faTrophy} /> Game Finished!
            </Title>
          </CardHeader>
          <h2>Your Result:</h2>
          <Table>
            <tbody>
              <TableRow>
                <TableCell>
                  <strong>Correct Answers:</strong>
                </TableCell>
                <TableCell>{playerResult?.correctAnswers}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Total Time:</strong>
                </TableCell>
                <TableCell>{formatTime(playerResult?.totalTime)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Points:</strong>
                </TableCell>
                <TableCell>{playerResult?.points}</TableCell>
              </TableRow>
            </tbody>
          </Table>
          <h2 className="mt-4">Leaderboard:</h2>
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Rank</TableHeader>
                  <TableHeader>Username</TableHeader>
                  <TableHeader>Points</TableHeader>
                  <TableHeader>Correct Answers</TableHeader>
                  <TableHeader>Time Taken</TableHeader>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.rank}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.points}</TableCell>
                    <TableCell>{item.correctAnswers}</TableCell>
                    <TableCell>{formatTime(item.timeTaken)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
          {/* {!gameEnded && (
            <Button onClick={handleEndGame}>
              <FontAwesomeIcon icon={faDoorOpen} /> End Game
            </Button>
          )} */}
          <Button onClick={() => navigate("/rooms")}>
            <FontAwesomeIcon icon={faDoorOpen} /> Go To Rooms
          </Button>
        </Card>
      </PageContainer>
    );
  }

  if (!questionsLoaded) {
    return (
      <PageContainer>
        <Card>
          <Title>
            <FontAwesomeIcon icon={faClock} spin /> Loading...
          </Title>
        </Card>
      </PageContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PageContainer className="mt-5">
      <Card>
        <CardHeader>
          <Title>
            <FontAwesomeIcon icon={faQuestionCircle} /> Question{" "}
            {currentQuestionIndex + 1}
          </Title>
        </CardHeader>
        <Question>{he.decode(currentQuestion.questionText)}</Question>
        <Timer>
          <FontAwesomeIcon icon={faClock} /> Time: {formatTime(totalTime)}
        </Timer>
        <OptionsList>
          {currentQuestion.options.map((option, index) => (
            <OptionItem key={index}>
              <input
                type="radio"
                name="option"
                value={option.optionNumber}
                checked={selectedOption === option.optionNumber}
                onChange={() => setSelectedOption(option.optionNumber)}
              />
              <span
                style={{ marginLeft: "10px" }}
                dangerouslySetInnerHTML={{
                  __html: he.decode(option.optionText),
                }}
              />
            </OptionItem>
          ))}
        </OptionsList>
        <Button
          onClick={handleSubmitAnswer}
          disabled={isSubmitting || selectedOption === null}
        >
          <FontAwesomeIcon icon={faCheckCircle} /> Submit Answer
        </Button>
      </Card>
    </PageContainer>
  );
}

export default StartQuestionsPage;
