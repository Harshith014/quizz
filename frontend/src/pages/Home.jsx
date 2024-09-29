import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <Container fluid className="home-container">
        <Row className="home-row">
          <Col md={6} className="home-col-left">
            <div className="home-left-content">
              <h1 className="home-title">QuizUp</h1>
              <p className="home-subtitle">
                Challenge yourself and others in our exciting quizzes!
              </p>
              <Button variant="primary" className="home-button" onClick={() => navigate("/rooms")}>
                Start Playing
              </Button>
            </div>
          </Col>
          <Col md={6} className="home-col-right">
            <div className="home-right-content">
              <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="50" y="50" width="200" height="200" rx="20" fill="#4CAF50" />
                <path d="M150 100 L200 150 L150 200 L100 150 Z" fill="#fff" />
                <path d="M150 150 L250 150" stroke="#fff" strokeWidth="10" />
                <path d="M150 150 L50 150" stroke="#fff" strokeWidth="10" />
                <path d="M150 100 L150 250" stroke="#fff" strokeWidth="10" />
                <circle cx="150" cy="150" r="50" fill="#fff" />
                <text x="150" y="280" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#fff">QuizUp</text>
              </svg>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;