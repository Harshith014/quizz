import {
  faExclamationTriangle,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { fadeIn } from "react-animations";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`${fadeIn}`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  animation: ${fadeInAnimation} 0.5s;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 400px;
`;

const StartButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 0.5rem;
  }
`;

const Logo = styled.svg`
  width: 150px;
  height: 150px;
  margin-bottom: 2rem;
`;

function StartGamePage() {
  const { roomId } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/game/${roomId}/start`,
        {
          roomId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Game started") {
        navigate(`/start-questions/${roomId}`);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An unknown error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Logo
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="50" y="50" width="200" height="200" rx="20" fill="#4CAF50" />
          <path d="M150 100 L200 150 L150 200 L100 150 Z" fill="#fff" />
          <path d="M150 150 L250 150" stroke="#fff" strokeWidth="10" />
          <path d="M150 150 L50 150" stroke="#fff" strokeWidth="10" />
          <path d="M150 100 L150 250" stroke="#fff" strokeWidth="10" />
          <circle cx="150" cy="150" r="50" fill="#fff" />
        </Logo>
        <Title>Start Your Game</Title>
        <Subtitle>
          Ready to challenge your knowledge? Click the button below to begin!
        </Subtitle>
        {error && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </ErrorMessage>
        )}
        <StartButton onClick={handleStartGame} disabled={isLoading}>
          <FontAwesomeIcon icon={faPlay} />{" "}
          {isLoading ? "Starting..." : "Start Game"}
        </StartButton>
      </ContentWrapper>
    </PageContainer>
  );
}

export default StartGamePage;
