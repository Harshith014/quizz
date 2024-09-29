import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const MessageBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Title = styled.h2`
  color: #4a4a4a;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #6a6a6a;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const LoginButton = styled.a`
  display: inline-block;
  background-color: #6e8efb;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5c7cfa;
  }
`;

const AuthRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <MessageContainer>
        <MessageBox>
          <Title>🎮 Game On, Player! 🎮</Title>
          <Message>
            Ready to join the ultimate quiz challenge? Log in now to unlock your
            full gaming potential!
          </Message>
          <LoginButton href="/login">Login to Play</LoginButton>
        </MessageBox>
      </MessageContainer>
    );
  }

  return <Component {...rest} />;
};

AuthRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default AuthRoute;
