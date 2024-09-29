import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { checkAuthStatus, logout } from "../redux/slices/authSlice";
import ButtonExample from "./Button";

function NavbarExample() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Navbar fixed="top" bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          QUIZZ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/leaderboards">
              Leaderboards
            </Nav.Link>
            <Nav.Link as={Link} to="/rooms">
              Rooms
            </Nav.Link>
          </Nav>
          <div className="d-flex ml-auto">
            <ButtonExample
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
            />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarExample;