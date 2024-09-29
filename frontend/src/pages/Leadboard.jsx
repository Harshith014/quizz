import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Table,
} from "react-bootstrap";
import "../css/leadboard.css";

function LeaderboardPage() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch all room leaderboards
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/leaderboard/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaderboards(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          "Failed to fetch leaderboards. Please try again later.",
          error
        );
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, [token]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Image
          src="https://picsum.photos/200/300"
          fluid
          className="d-block mx-auto"
        />
        <h1>Loading...</h1>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={12} className="text-center">
          <h1>Leaderboards</h1>
          <Badge variant="primary">Top Players</Badge>
        </Col>
      </Row>
      {leaderboards.length > 0 ? (
        leaderboards.map((leaderboard) => (
          <Card
            key={leaderboard._id}
            className="mb-4"
            style={{
              border: "2px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Header
              className="text-center"
              style={{
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <h2>
                Room ID: {leaderboard.roomId}{" "}
                <Badge variant="secondary">{leaderboard.gameId}</Badge>
              </h2>
              <p>
                Created At: {new Date(leaderboard.createdAt).toLocaleString()}
              </p>
            </Card.Header>
            <Card.Body
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "0 0 10px 10px",
              }}
            >
              {leaderboard.leaderboard && leaderboard.leaderboard.length > 0 ? (
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
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Correct Answers</th>
                      <th>Points</th>
                      <th>Time Taken (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.leaderboard.map((player) => (
                      <tr key={player.userId}>
                        <td>
                          <Badge variant="primary">{player.rank}</Badge>
                        </td>
                        <td>{player.username}</td>
                        <td>{player.correctAnswers}</td>
                        <td>{player.points}</td>
                        <td>{(player.timeTaken / 1000).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <h5 className="text-center">
                  No leaderboard data available for this room!
                </h5>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <h3 className="text-center mt-4">
          No rooms with leaderboards available yet!
        </h3>
      )}

      {/* Optional: Refresh button for manual refreshing */}
      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => window.location.reload()}>
          Refresh Leaderboards
        </Button>
      </div>
    </Container>
  );
}

export default LeaderboardPage;
