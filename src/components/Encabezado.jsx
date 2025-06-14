import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logoFerreteria from '../assets/ferreteria_selva_logo.png';
import { useAuth } from '../assets/database/authcontext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import { useTranslation } from 'react-i18next';

const Encabezado = () => {
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsCollapsed(false);
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPassword');
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const handleNavigate = (path) => {
    navigate(path);
    setIsCollapsed(false);
  };

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        <Navbar.Brand onClick={() => handleNavigate('/inicio')} className="text-white" style={{ cursor: 'pointer' }}>
          <img alt="" src={logoFerreteria} width="30" height="30" className="d-inline-block align-top" />{' '}
          <strong>Ferreteria Gisela</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" onClick={handleToggle} />
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={isCollapsed}
          onHide={() => setIsCollapsed(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={isCollapsed ? 'color-texto-marca' : 'text-white'}
            >
              <i className="bi bi-list me-2"></i>{t('menu.titulo')}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link onClick={() => handleNavigate('/inicio')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                <i className="bi bi-house-door-fill me-2"></i>
                <strong>{t('menu.inicio')}</strong>
              </Nav.Link>
              <Nav.Link onClick={() => handleNavigate('/catalogo')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                <i className="bi bi-book me-2"></i>
                <strong>{t('menu.catalogo')}</strong>
              </Nav.Link>
              {isLoggedIn && (
                <>
                  <Nav.Link onClick={() => handleNavigate('/categorias')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-tags me-2"></i>
                    <strong>{t('menu.categorias')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/productos')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-box-seam me-2"></i>
                    <strong>{t('menu.productos')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/libros')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-book me-2"></i>
                    <strong>{t('menu.libros')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/clima')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-cloud-sun-fill me-2"></i>
                    <strong>{t('menu.clima')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/estadisticas')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    <strong>{t('menu.estadisticas')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/pronunciacion')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-mic-fill me-2"></i>
                    <strong>{t('menu.pronunciacion')}</strong>
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate('/empleados')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                    <i className="bi bi-person-fill-check me-2"></i>
                    <strong>{t('menu.empleados')}</strong>
                  </Nav.Link>
                </>
              )}
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  <strong>{t('menu.cerrarsesion')}</strong>
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => handleNavigate('/')} className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  <strong>{t('menu.iniciarsesion')}</strong>
                </Nav.Link>
              )}
            </Nav>

            {/* Selector de idioma */}
            <div className="mt-3 px-3">
              <span className={isCollapsed ? 'color-texto-marca' : 'text-white'}>
                <i className="bi bi-translate me-2"></i><strong>{t('menu.idioma')}:</strong>
              </span>
              <div className="d-flex gap-2 mt-2">
                <button onClick={() => cambiarIdioma('es')} className="btn btn-outline-light btn-sm">
                  {t('menu.español')}
                </button>
                <button onClick={() => cambiarIdioma('en')} className="btn btn-outline-light btn-sm">
                  {t('menu.ingles')}
                </button>
              </div>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;
