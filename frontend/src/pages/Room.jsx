import axios from "axios";
import he from "he";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/room.css";

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
        {
          roomId,
          category,
          difficulty,
          questionCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGames([...games, response.data.game]);
      setRoomId("");
      setCategory("");
      setDifficulty("");
      setQuestionCount("");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  const handleGetGames = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/game/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGames(response.data.games);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <Container fluid className="p-0 my-5" style={{ overflow: "hidden" }}>
      <Row className="justify-content-center">
        <Col md={6} className="p-5">
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h2>Create a new game room</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="roomId">
                  <Form.Label>Room ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={roomId}
                    onChange={(event) => setRoomId(event.target.value)}
                    placeholder="Enter room ID"
                  />
                </Form.Group>

                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Enter category"
                  />
                </Form.Group>

                <Form.Group controlId="difficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    type="text"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                    placeholder="Enter difficulty"
                  />
                </Form.Group>

                <Form.Group controlId="questionCount">
                  <Form.Label>Question Count</Form.Label>
                  <Form.Control
                    type="number"
                    value={questionCount}
                    onChange={(event) => setQuestionCount(event.target.value)}
                    placeholder="Enter question count"
                  />
                </Form.Group>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <Button variant="primary" type="submit">
                  Create Room
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="p-5">
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <h2>Existing game rooms</h2>
            </Card.Header>
            <Card.Body>
              <Button variant="primary" onClick={handleGetGames}>
                Get Games
              </Button>
              <div style={{ overflowX: "auto" }}>
                <Table
                  striped
                  bordered
                  hover
                  responsive="md"
                  className="text-center"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Room ID</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Question Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game) => (
                      <tr key={`${game.roomId}-${game.category}`}>
                        <td>{game.roomId}</td>
                        <td>
                          {game.category && game.category.includes(": ")
                            ? he.decode(game.category.split(": ")[1])
                            : he.decode(game.category)}
                        </td>
                        <td>{game.difficulty}</td>
                        <td>{game.questionCount}</td>
                        <td>
                          <Link to={`/start-game/${game.roomId}`}>
                            <Button variant="primary">Enter Room</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RoomPage;
