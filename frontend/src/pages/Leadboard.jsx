import { faGamepad, faSync, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { fadeIn } from "react-animations";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`${fadeIn}`;

const LeaderboardContainer = styled.div`
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

const Subtitle = styled.p`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const LeaderboardCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const RoomInfo = styled.div`
  h2 {
    color: #4a4a4a;
    font-size: 1.5rem;
    margin: 0;
  }
  p {
    color: #6a6a6a;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const Badge = styled.span`
  background-color: #6e8efb;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
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

const RankBadge = styled.span`
  background-color: ${(props) =>
    props.rank === 1
      ? "#FFD700"
      : props.rank === 2
      ? "#C0C0C0"
      : props.rank === 3
      ? "#CD7F32"
      : "#6e8efb"};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  font-weight: bold;
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

function LeaderboardPage() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/leaderboard/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaderboards(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch leaderboards. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LeaderboardContainer>
        <Title>
          <FontAwesomeIcon icon={faGamepad} spin /> Loading...
        </Title>
      </LeaderboardContainer>
    );
  }

  if (error) {
    return (
      <LeaderboardContainer>
        <Title>Error</Title>
        <Subtitle>{error}</Subtitle>
        <Button onClick={fetchLeaderboards}>
          <FontAwesomeIcon icon={faSync} /> Retry
        </Button>
      </LeaderboardContainer>
    );
  }

  return (
    <LeaderboardContainer className="mt-5">
      <Title>
        <FontAwesomeIcon icon={faTrophy} /> Leaderboards
      </Title>
      <Subtitle>Check out the top players across all game rooms!</Subtitle>

      {leaderboards.length > 0 ? (
        leaderboards.map((leaderboard) => (
          <LeaderboardCard key={leaderboard._id}>
            <CardHeader>
              <RoomInfo>
                <h2>Room ID: {leaderboard.roomId}</h2>
                <p>
                  Created At: {new Date(leaderboard.createdAt).toLocaleString()}
                </p>
              </RoomInfo>
              <Badge>{leaderboard.gameId}</Badge>
            </CardHeader>

            {leaderboard.leaderboard && leaderboard.leaderboard.length > 0 ? (
              <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>Rank</TableHeader>
                      <TableHeader>Player</TableHeader>
                      <TableHeader>Correct Answers</TableHeader>
                      <TableHeader>Points</TableHeader>
                      <TableHeader>Time Taken (s)</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.leaderboard.map((player) => (
                      <TableRow key={player.userId}>
                        <TableCell>
                          <RankBadge rank={player.rank}>
                            {player.rank}
                          </RankBadge>
                        </TableCell>
                        <TableCell>{player.username}</TableCell>
                        <TableCell>{player.correctAnswers}</TableCell>
                        <TableCell>{player.points}</TableCell>
                        <TableCell>
                          {(player.timeTaken / 1000).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>No leaderboard data available for this room.</p>
            )}
          </LeaderboardCard>
        ))
      ) : (
        <Subtitle>No rooms with leaderboards available yet!</Subtitle>
      )}

      <Button onClick={fetchLeaderboards}>
        <FontAwesomeIcon icon={faSync} /> Refresh Leaderboards
      </Button>
    </LeaderboardContainer>
  );
}

export default LeaderboardPage;
