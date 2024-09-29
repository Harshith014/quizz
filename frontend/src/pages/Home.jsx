import { faGamepad, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fadeIn } from "react-animations";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`${fadeIn}`;

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  animation: ${fadeInAnimation} 0.5s;
`;

const HomeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
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
`;

const Logo = styled.svg`
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
`;

function Home() {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <HomeContent>
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
        <Title>
          <FontAwesomeIcon icon={faGamepad} /> QuizUp
        </Title>
        <Subtitle>
          Challenge yourself and others in our exciting quizzes!
        </Subtitle>
        <StartButton onClick={() => navigate("/rooms")}>
          <FontAwesomeIcon icon={faPlay} /> Start Playing
        </StartButton>
      </HomeContent>
    </HomeContainer>
  );
}

export default Home;
