import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import instruccionesGif from '../../assets/instrucciones.gif';

const ModalIntalacionOIS= ({ mostrar, cerrar }) => {
  return (
    <Modal show={mostrar} onHide={cerrar} centered >
        <Modal.Header closeButton>
            <Modal.Title>Instrucciones para instalar la PWA en iOS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>1. Sigue estos pasos para agregar la aplicación a tu pantalla de inicio.</p>
            <ol>
                <li>Abre esta pagina en Safari.</li>
                <li>Presiona el boton Compartir.(<i className='bi bi-box-arrow-down'></i>)</li>
                <li>Selecciona "Agregar a pantalla de inicio".</li>
                <li>Confirma el nombre y preciona "Agregar".</li>
            </ol>
            <div className='text-center mt-3'>
                <img src={instruccionesGif} alt="Instrucciones" className='img-fluid' />
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={cerrar}>Cerrar</Button>
        </Modal.Footer>
    </Modal>
  )

}

export default ModalIntalacionOIS;
