import {
  faGamepad,
  faPuzzlePiece,
  faQuestionCircle,
  faTrophy,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"; // Game-related icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Font Awesome icons
import axios from "axios";
import { useState } from "react";
import { fadeIn } from "react-animations"; // Lightweight animation library
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components"; // For animation styling
import "../css/style.css";

const animation = keyframes`${fadeIn}`;

const AnimatedContainer = styled(Container)`
  animation: ${animation} 0.5s;
`;

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/register`,
        {
          email,
          password,
          username,
        }
      );
      const data = response.data;
      console.log("Successful");

      if (data.message === "User created successfully") {
        // Clear the fields
        setEmail("");
        setPassword("");
        setUsername("");
        // Redirect to login page or perform any other action after registration
        navigate("/login")
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Server error", error);
    }
  };

  return (
    <AnimatedContainer className="my-5" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col md={6} className="p-4 bg-light rounded">
          <h2 className="text-center">
            <FontAwesomeIcon icon={faUserPlus} size="lg" /> Register
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>
                <FontAwesomeIcon icon={faQuestionCircle} /> Email
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>
                <FontAwesomeIcon icon={faPuzzlePiece} /> Password
              </Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>

            <Form.Group controlId="username">
              <Form.Label>
                <FontAwesomeIcon icon={faGamepad} /> Username
              </Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faTrophy} /> Register
            </Button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="#" onClick={() => navigate("/login")}>
                Login now!
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </AnimatedContainer>
  );
};

export default RegisterPage;
