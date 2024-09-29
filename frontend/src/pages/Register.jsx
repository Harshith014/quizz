import {
  faEnvelope,
  faGamepad,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { fadeIn } from "react-animations";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`${fadeIn}`;

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  animation: ${fadeInAnimation} 0.5s;
`;

const RegisterBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #4a4a4a;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  color: #6a6a6a;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #6e8efb;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5c7cfa;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #6a6a6a;

  a {
    color: #6e8efb;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function RegisterPage() {
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
        { email, password, username }
      );
      const data = response.data;
      if (data.message === "User created successfully") {
        setEmail("");
        setPassword("");
        setUsername("");
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Server error: " + error.message);
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <Title>
          <FontAwesomeIcon icon={faUserPlus} /> Register
        </Title>
        <StyledForm onSubmit={handleSubmit}>
          <InputGroup>
            <Label>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ marginRight: "0.5rem" }}
              />{" "}
              Email
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>
              <FontAwesomeIcon
                icon={faLock}
                style={{ marginRight: "0.5rem" }}
              />{" "}
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginRight: "0.5rem" }}
              />{" "}
              Username
            </Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </InputGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">
            <FontAwesomeIcon icon={faGamepad} /> Register
          </SubmitButton>
        </StyledForm>
        <LoginLink>
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/login")}>
            Login now!
          </a>
        </LoginLink>
      </RegisterBox>
    </RegisterContainer>
  );
}

export default RegisterPage;
