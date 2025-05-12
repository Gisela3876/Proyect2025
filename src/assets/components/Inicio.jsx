import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BiStore, BiCart, BiUser, BiBarChart } from 'react-icons/bi';
import '../../App.css';

const Inicio = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center fw-bold mb-4">Panel de Control</h1>
          <p className="text-center text-muted">Bienvenido al sistema de gestión de la ferretería</p>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Tarjeta de Productos */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <BiStore className="display-4 mb-3 text-primary" />
              <Card.Title className="fw-bold">Productos</Card.Title>
              <Card.Text className="text-muted mb-4">
                Gestiona el inventario de productos
              </Card.Text>
              <Button 
                variant="primary" 
                className="w-100"
                style={{ backgroundColor: '#0093E9', borderColor: '#0093E9' }}
              >
                Ver Productos
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta de Ventas */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <BiCart className="display-4 mb-3 text-success" />
              <Card.Title className="fw-bold">Ventas</Card.Title>
              <Card.Text className="text-muted mb-4">
                Registra y gestiona las ventas
              </Card.Text>
              <Button 
                variant="success" 
                className="w-100"
              >
                Nueva Venta
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta de Clientes */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <BiUser className="display-4 mb-3 text-info" />
              <Card.Title className="fw-bold">Clientes</Card.Title>
              <Card.Text className="text-muted mb-4">
                Administra la información de clientes
              </Card.Text>
              <Button 
                variant="info" 
                className="w-100 text-white"
              >
                Ver Clientes
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Tarjeta de Reportes */}
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <BiBarChart className="display-4 mb-3 text-warning" />
              <Card.Title className="fw-bold">Reportes</Card.Title>
              <Card.Text className="text-muted mb-4">
                Visualiza estadísticas y reportes
              </Card.Text>
              <Button 
                variant="warning" 
                className="w-100 text-white"
              >
                Ver Reportes
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sección de Resumen */}
      <Row className="mt-5">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title fw-bold mb-4">Resumen de Ventas</h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Ventas del día</span>
                <span className="fw-bold">$0.00</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Ventas de la semana</span>
                <span className="fw-bold">$0.00</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Ventas del mes</span>
                <span className="fw-bold">$0.00</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title fw-bold mb-4">Estado del Inventario</h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Productos en stock</span>
                <span className="fw-bold">0</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Productos bajos en stock</span>
                <span className="fw-bold">0</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Productos sin stock</span>
                <span className="fw-bold">0</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;