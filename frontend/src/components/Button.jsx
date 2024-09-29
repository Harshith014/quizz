import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function ButtonExample({ isAuthenticated, handleLogout }) {
  return (
    <div className="d-flex">
      {isAuthenticated ? (
        <Button variant="dark" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <>
          <Button variant="dark" as={Link} to="/login">
            Login
          </Button>
          <Button variant="dark" as={Link} to="/signup">
            Signup
          </Button>
        </>
      )}
    </div>
  );
}

ButtonExample.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default ButtonExample;
