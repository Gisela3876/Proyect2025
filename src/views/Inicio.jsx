import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalInstalacionIOS from "../components/inicio/ModalInstalacionIOS";
import { Button } from "react-bootstrap";

const Inicio = () => {
    const navigate = useNavigate();
    const [solicitudInstalacion, setSolicitudInstalacion] = useState(null);
    const [mostrarBotonInstalacion, setMostrarBotonInstalacion] = useState(false);
    const [esDispositivoIOS, setEsDispositivoIOS] = useState(false);
    const [mostrarModalInstrucciones, setMostrarModalInstrucciones] = useState(false);

    const abrirModalInstrucciones = () => {
        console.log("Abriendo modal");
        setMostrarModalInstrucciones(true);
    };
    const cerrarModalInstrucciones = () => {
        console.log("Cerrando modal");
        setMostrarModalInstrucciones(false);
    };

    // Detectar dispositivo iOS
    useEffect(() => {
        const esIOS = /iPad|iPhone/.test(navigator.userAgent) && !window.MSStream;
        console.log("Es iOS:", esIOS, "UserAgent:", navigator.userAgent);
        setEsDispositivoIOS(esIOS);
    }, []);

    // Manejar evento beforeinstallprompt
    useEffect(() => {
        const manejarSolicitudInstalacion = (evento) => {
            console.log("Evento beforeinstallprompt disparado:", evento);
            evento.preventDefault();
            setSolicitudInstalacion(evento);
            setMostrarBotonInstalacion(true);
        };
        window.addEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        return () => {
            window.removeEventListener("beforeinstallprompt", manejarSolicitudInstalacion);
        };
    }, []);

    const instalacion = async () => {
        if (!solicitudInstalacion) {
            console.log("No hay solicitud de instalación disponible");
            return;
        }

        try {
            await solicitudInstalacion.prompt();
            const { outcome } = await solicitudInstalacion.userChoice;
            console.log(outcome === "accepted" ? "Instalación aceptada" : "Instalación rechazada");
        } catch (error) {
            console.error("Error al instalar la aplicación:", error);
            alert("No se pudo instalar la PWA. Inténtalo de nuevo.");
        } finally {
            setSolicitudInstalacion(null);
            setMostrarBotonInstalacion(false);
        }
    };

    return (
        <div className="inicio-container">
            <h1>Inicio</h1>
            <div className="my-4">
                <Button
                    className="sombra me-2"
                    variant="secondary"
                    onClick={() => navigate("/categorias")}
                >
                    Ir a Categorías
                </Button>
                <Button
                    className="sombra"
                    variant="secondary"
                    onClick={() => navigate("/productos")}
                >
                    Ir a Productos
                </Button>
            </div>

            {!esDispositivoIOS && mostrarBotonInstalacion && (
                <div className="my-4 text-center">
                    <Button className="sombra" variant="primary" onClick={instalacion}>
                        Instalar PWA <i className="bi bi-download"></i>
                    </Button>
                </div>
            )}

            {esDispositivoIOS && (
                <div className="my-4 text-center">
                    <Button className="sombra" variant="primary" onClick={abrirModalInstrucciones}>
                        Cómo instalar PWA en iOS <i className="bi bi-phone"></i>
                    </Button>
                </div>
            )}

            <ModalInstalacionIOS
                mostrar={mostrarModalInstrucciones}
                cerrar={cerrarModalInstrucciones}
            />
        </div>
    );
};

export default Inicio;