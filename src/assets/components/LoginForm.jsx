import React from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import "../../App.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, handleSubmit }) => {
  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4}>
        <Card className="p-4 shadow-lg border-0 rounded-3">
          <Card.Body>
            <h3 className="text-center mb-4 fw-bold">Iniciar Sesión</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="emailUsuario">
                <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="contraseñaUsuario">
                <Form.Label className="fw-semibold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 fw-semibold"
                style={{ backgroundColor: '#0093E9', borderColor: '#0093E9' }}
              >
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;