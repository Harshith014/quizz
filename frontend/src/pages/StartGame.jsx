import axios from 'axios';
import { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function StartGamePage() {
  const { roomId } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/game/${roomId}/start`, {
        roomId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      if (response.data.message === 'Game started') {
        navigate(`/start-questions/${roomId}`); // Navigate to /start-questions/:roomId
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <h2>Start Game</h2>
          <Form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Button variant="primary" type="submit">
              Start Game
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default StartGamePage;