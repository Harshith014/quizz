import {
  faEnvelope,
  faGamepad,
  faLock,
  faPuzzlePiece,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { fadeIn } from "react-animations";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { login } from "../redux/slices/authSlice";

const fadeInAnimation = keyframes`${fadeIn}`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  animation: ${fadeInAnimation} 0.5s;
`;

const LoginBox = styled.div`
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const RegisterLink = styled.p`
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
      navigate("/");
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>
          <FontAwesomeIcon icon={faGamepad} /> Login to Play
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
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <FontAwesomeIcon icon={faTrophy} spin />
            ) : (
              <FontAwesomeIcon icon={faPuzzlePiece} />
            )}{" "}
            {loading ? "Logging in..." : "Login"}
          </SubmitButton>
        </StyledForm>
        <RegisterLink>
          No account?{" "}
          <a href="#" onClick={() => navigate("/signup")}>
            Register now!
          </a>
        </RegisterLink>
      </LoginBox>
    </LoginContainer>
  );
}

export default Login;
