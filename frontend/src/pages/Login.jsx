import {
  faGamepad,
  faPuzzlePiece,
  faQuestionCircle,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons"; // Game-related icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Font Awesome icons
import { useState } from "react";
import { fadeIn } from "react-animations"; // Lightweight animation library
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components"; // For animation styling
import "../css/style.css";
import { login } from "../redux/slices/authSlice"; // Adjust the import path as necessary

const animation = keyframes`${fadeIn}`;

const AnimatedContainer = styled(Container)`
  animation: ${animation} 0.5s;
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      setEmail("");
      setPassword("");
      navigate("/"); // Redirect to home page or dashboard after successful login
    }
  };

  return (
    <AnimatedContainer className="my-5" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col md={6} className="p-4 bg-light rounded">
          <h2 className="text-center">
            <FontAwesomeIcon icon={faGamepad} size="lg" /> Login
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>
                <FontAwesomeIcon icon={faQuestionCircle} /> Email
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <FontAwesomeIcon icon={faTrophy} spin />
              ) : (
                <FontAwesomeIcon icon={faGamepad} />
              )}
              Login
            </Button>

            <p className="text-center mt-3">
              No account?{" "}
              <a href="#" onClick={() => navigate("/signup")}>
                Register now!
              </a>
            </p>
          </Form>
        </Col>
      </Row>
    </AnimatedContainer>
  );
}

export default Login;
