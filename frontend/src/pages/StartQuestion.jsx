import axios from "axios";
import he from "he";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function StartQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerResult, setPlayerResult] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const { roomId } = useParams();
  const token = localStorage.getItem("token");

  // Function to start the timer
  const startTimer = () => {
    const timer = setInterval(() => {
      setTotalTime((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(timer);
  };

  // Function to format time
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/game/${roomId}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuestions(response.data.questions);
        setQuestionsLoaded(true);
        startTimer();
      })
      .catch((error) => {
        console.error(error);
      });
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
    }
  };

  const handleOptionSelect = (optionNumber) => {
    setSelectedOption(optionNumber);
  };

  const handleEndGame = async () => {
    try {
      const userId = jwtDecode(token).id;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/game/end`,
        { roomId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success || response.data.game.status === "ended") {
        setGameEnded(true);
        alert("The game has been successfully ended.");
      } else {
        alert("Failed to end the game. Please try again.");
      }
    } catch (error) {
      console.error("Error ending the game:", error);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerId);
  }, [timerId]);

  if (isGameFinished) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <Card.Header>
                <h1>Game Finished!</h1>
              </Card.Header>
              <Card.Body>
                <h2>Your Result:</h2>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Correct Answers:</strong>{" "}
                    {playerResult?.correctAnswers}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Total Time:</strong>{" "}
                    {formatTime(playerResult?.totalTime)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Points:</strong> {playerResult?.points}
                  </ListGroup.Item>
                </ListGroup>
                <h2 className="mt-4">Leaderboard:</h2>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Username</th>
                      <th>Points</th>
                      <th>Correct Answers</th>
                      <th>Time Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((item, index) => (
                      <tr key={index}>
                        <td>{item.rank}</td>
                        <td>{item.username}</td>
                        <td>{item.points}</td>
                        <td>{item.correctAnswers}</td>
                        <td>{formatTime(item.timeTaken)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="text-center">
                {!gameEnded && (
                  <Button variant="primary" onClick={handleEndGame}>
                    End Game
                  </Button>
                )}
                <Button
                  variant="success"
                  className="ml-2"
                  onClick={() => navigate("/rooms")}
                >
                  Go To Rooms
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!questionsLoaded) {
    return <h1>Loading...</h1>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <Card.Header>
                <h1>Question {currentQuestionIndex + 1}</h1>
              </Card.Header>
              <Card.Body>
                <h2>{he.decode(currentQuestion.questionText)}</h2>
                <p>Time: {formatTime(totalTime)}</p>
                <ListGroup variant="flush">
                  {currentQuestion.options.map((option, index) => (
                    <ListGroup.Item key={index}>
                      <input
                        type="radio"
                        name="option"
                        value={option.optionNumber}
                        checked={selectedOption === option.optionNumber}
                        onChange={() => handleOptionSelect(option.optionNumber)}
                      />
                      <span className="ml-2">{option.optionText}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StartQuestionsPage;
