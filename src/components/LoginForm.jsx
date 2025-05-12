import React from "react";
import { Row, Col, Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import "../App.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, handleSubmit, isLoading }) => {
  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4}>
        <Card className="p-4 shadow-lg" style={{ borderRadius: '15px' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
                }}
              >
                <i className="bi bi-person-circle text-white fs-3"></i>
              </div>
              <h3 className="fw-bold color-texto-marca">Iniciar Sesión</h3>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4 text-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailUsuario">
                <Form.Label className="text-start w-100 fw-semibold">
                  <i className="bi bi-envelope-fill me-2 text-primary"></i>
                  Correo Electrónico
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-lg"
                    disabled={isLoading}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="contraseñaUsuario">
                <Form.Label className="text-start w-100 fw-semibold">
                  <i className="bi bi-key-fill me-2 text-primary"></i>
                  Contraseña
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control-lg"
                    disabled={isLoading}
                  />
                </InputGroup>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 btn-login py-3 position-relative"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
                  border: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {isLoading ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm me-2" 
                      role="status" 
                      aria-hidden="true"
                      style={{ width: '1.2rem', height: '1.2rem' }}
                    ></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;