import Spinner from 'react-bootstrap/Spinner';

const LoadingComponent = () => {
  return (
    <div className="loading-container text-center">
      <h3>Loading...</h3>
      <div className="d-flex justify-content-center">
        <Spinner animation="grow" variant="primary" className="m-2" />
        <Spinner animation="grow" variant="secondary" className="m-2" />
        <Spinner animation="grow" variant="success" className="m-2" />
        <Spinner animation="grow" variant="danger" className="m-2" />
        <Spinner animation="grow" variant="warning" className="m-2" />
        <Spinner animation="grow" variant="info" className="m-2" />
        <Spinner animation="grow" variant="light" className="m-2" />
        <Spinner animation="grow" variant="dark" className="m-2" />
      </div>
    </div>
  );
};

export default LoadingComponent;