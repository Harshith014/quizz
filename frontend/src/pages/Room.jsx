import {
  faDoorOpen,
  faExclamationTriangle,
  faList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import he from "he";
import { useState } from "react";
import { fadeIn } from "react-animations";
import { Link } from "react-router-dom";
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

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
`;

const CardHeader = styled.div`
  background-color: #6e8efb;
  color: white;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
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

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #6e8efb;
  color: white;
  padding: 0.8rem;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f8f8;
  }
`;

const TableCell = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #ddd;
`;

function RoomPage() {
  const [roomId, setRoomId] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/game/create`,
        { roomId, category, difficulty, questionCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames([...games, response.data.game]);
      setRoomId("");
      setCategory("");
      setDifficulty("");
      setQuestionCount("");
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unknown error occurred. Please try again."
      );
    }
  };

  const handleGetGames = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/game/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames(response.data.games);
      setError(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unknown error occurred. Please try again."
      );
    }
  };

  return (
    <PageContainer className="mt-5">
      <Title>
        <FontAwesomeIcon icon={faList} /> Game Rooms
      </Title>
      <CardsContainer>
        <Card>
          <CardHeader>
            <h2>
              <FontAwesomeIcon icon={faPlus} /> Create a new game room
            </h2>
          </CardHeader>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
            />
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
            <Input
              type="text"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              placeholder="Enter difficulty"
            />
            <Input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Enter question count"
            />
            {error && (
              <ErrorMessage>
                <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
              </ErrorMessage>
            )}
            <Button type="submit">Create Room</Button>
          </Form>
        </Card>
        <Card>
          <CardHeader>
            <h2>
              <FontAwesomeIcon icon={faList} /> Existing game rooms
            </h2>
          </CardHeader>
          <Button onClick={handleGetGames}>Get Games</Button>
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Room ID</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Difficulty</TableHeader>
                  <TableHeader>Question Count</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <TableRow key={`${game.roomId}-${game.category}`}>
                    <TableCell>{game.roomId}</TableCell>
                    <TableCell>
                      {game.category && game.category.includes(": ")
                        ? he.decode(game.category.split(": ")[1])
                        : he.decode(game.category)}
                    </TableCell>
                    <TableCell>{game.difficulty}</TableCell>
                    <TableCell>{game.questionCount}</TableCell>
                    <TableCell>
                      <Link to={`/start-game/${game.roomId}`}>
                        <Button>
                          <FontAwesomeIcon icon={faDoorOpen} /> Enter Room
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </CardsContainer>
    </PageContainer>
  );
}

export default RoomPage;
