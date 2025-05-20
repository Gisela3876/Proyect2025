import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../assets/database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import TablaLibros from "../components/Libros/TablaLibros";
import ModalRegistroLibro from "../components/Libros/ModalRegistroLibro";
import ModalEdicionLibro from "../components/Libros/ModalEdicionLibro";
import ModalEliminacionLibro from "../components/Libros/ModalEliminacionLibro";
import AnimacionEliminacion from "../components/Libros/AnimacionEliminacion";
import AnimacionRegistro from "../components/Libros/AnimacionRegistro";
import { useAuth } from "../assets/database/authcontext";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";
import ModalQR from "../components/Qr/ModalQR";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnimacionRegistro, setShowAnimacionRegistro] = useState(false);
  const [showAnimacionEliminar, setShowAnimacionEliminar] = useState(false);
  const [nuevoLibro, setNuevoLibro] = useState({
    nombre: "",
    autor: "",
    genero: "",
    pdfUrl: "",
  });
  const [libroEditado, setLibroEditado] = useState(null);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const librosCollection = collection(db, "Libros");

  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const librosData = await getDocs(librosCollection);
      const fetchedLibros = librosData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setLibros(fetchedLibros);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError(`Error al cargar los datos: ${error.message}`);
    }
  }, [librosCollection]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [isLoggedIn, navigate, fetchData]);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    if (!lowerSearchTerm) {
      setFilteredLibros(libros);
    } else {
      const filtered = libros.filter((libro) =>
        (libro.nombre?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (libro.autor?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (libro.genero?.toLowerCase() || "").includes(lowerSearchTerm)
      );
      setFilteredLibros(filtered);
    }
  }, [searchTerm, libros]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setLibroEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Por favor, selecciona un archivo PDF.");
    }
  };

  const handleEditPdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Por favor, selecciona un archivo PDF.");
    }
  };

  const handleAddLibro = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar un libro.");
      navigate("/login");
      return;
    }

    if (!nuevoLibro.nombre || !nuevoLibro.autor || !nuevoLibro.genero || !pdfFile) {
      alert("Por favor, completa todos los campos y selecciona un PDF.");
      return;
    }
    try {
      setShowAnimacionRegistro(true);
      const storageRef = ref(storage, `libros/${pdfFile.name}`);
      await uploadBytes(storageRef, pdfFile);
      const pdfUrl = await getDownloadURL(storageRef);

      await addDoc(librosCollection, {
        ...nuevoLibro,
        pdfUrl,
        pdfPath: `libros/${pdfFile.name}`,
      });
      setShowModal(false);
      setNuevoLibro({ nombre: "", autor: "", genero: "", pdfUrl: "" });
      setPdfFile(null);
      await fetchData();
    } catch (error) {
      console.error("Error al agregar libro:", error);
      setError(`Error al agregar el libro: ${error.message}`);
    } finally {
      setShowAnimacionRegistro(false);
    }
  };

  const handleEditLibro = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para editar un libro.");
      navigate("/login");
      return;
    }

    if (!libroEditado.nombre || !libroEditado.autor || !libroEditado.genero) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    try {
      setShowAnimacionRegistro(true);
      const libroRef = doc(db, "Libros", libroEditado.id);
      if (pdfFile) {
        if (libroEditado.pdfPath) {
          const oldPdfRef = ref(storage, libroEditado.pdfPath);
          await deleteObject(oldPdfRef).catch((error) => {
            console.error("Error al eliminar el PDF anterior:", error);
          });
        }
        const storageRef = ref(storage, `libros/${pdfFile.name}`);
        await uploadBytes(storageRef, pdfFile);
        const newPdfUrl = await getDownloadURL(storageRef);
        await updateDoc(libroRef, {
          ...libroEditado,
          pdfUrl: newPdfUrl,
          pdfPath: `libros/${pdfFile.name}`,
        });
      } else {
        await updateDoc(libroRef, libroEditado);
      }
      setShowEditModal(false);
      setPdfFile(null);
      await fetchData();
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      setError(`Error al actualizar el libro: ${error.message}`);
    } finally {
      setShowAnimacionRegistro(false);
    }
  };

  const handleDeleteLibro = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para eliminar un libro.");
      navigate("/login");
      return;
    }

    if (libroAEliminar) {
      try {
        setShowAnimacionEliminar(true);
        const libroRef = doc(db, "Libros", libroAEliminar.id);
        if (libroAEliminar.pdfPath) {
          const pdfRef = ref(storage, libroAEliminar.pdfPath);
          await deleteObject(pdfRef).catch((error) => {
            console.error("Error al eliminar el PDF de Storage:", error);
          });
        }
        await deleteDoc(libroRef);
        setShowDeleteModal(false);
        await fetchData();
      } catch (error) {
        console.error("Error al eliminar libro:", error);
        setError(`Error al eliminar el libro: ${error.message}`);
      } finally {
        setShowAnimacionEliminar(false);
      }
    }
  };

  const openEditModal = (libro) => {
    setLibroEditado({ ...libro });
    setShowEditModal(true);
  };

  const openDeleteModal = (libro) => {
    setLibroAEliminar(libro);
    setShowDeleteModal(true);
  };

  const openQRModal = (url) => {
    if (!url) {
      setError("No se puede generar el QR: URL del PDF no disponible.");
      return;
    }
    setSelectedUrl(url);
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setSelectedUrl("");
  };

  const handleCopy = (libro) => {
    const rowData = `Nombre: ${libro.nombre}\nAutor: ${libro.autor}\nGénero: ${libro.genero}\nURL PDF: ${libro.pdfUrl || "No disponible"}`;
    navigator.clipboard
      .writeText(rowData)
      .then(() => {
        console.log("Datos del libro copiados al portapapeles:\n" + rowData);
        alert("Datos del libro copiados al portapapeles.");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  };

  const paginatedLibros = filteredLibros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="mt-5">
      <br />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestión de Libros</h4>
        {isLoggedIn && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Libro
          </Button>
        )}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <CuadroBusquedas
        searchText={searchTerm}
        handleSearchChange={handleSearchChange}
        placeholder="Buscar libro por nombre, autor o género..."
      />

      {paginatedLibros.length === 0 && (
        <Alert variant="info">No se encontraron libros.</Alert>
      )}
      <TablaLibros
        libros={paginatedLibros}
        openQRModal={openQRModal}
        handleCopy={handleCopy}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        isLoggedIn={isLoggedIn}
      />

      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={filteredLibros.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ModalRegistroLibro
        showModal={showModal}
        setShowModal={setShowModal}
        nuevoLibro={nuevoLibro}
        handleInputChange={handleInputChange}
        handlePdfChange={handlePdfChange}
        handleAddLibro={handleAddLibro}
      />
      <ModalEdicionLibro
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        libroEditado={libroEditado}
        setLibroEditado={setLibroEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditPdfChange={handleEditPdfChange}
        setPdfFile={setPdfFile}
        handleEditLibro={handleEditLibro}
      />
      <ModalEliminacionLibro
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteLibro={handleDeleteLibro}
      />
      <AnimacionEliminacion
        show={showAnimacionEliminar}
        onHide={() => setShowAnimacionEliminar(false)}
      />
      <AnimacionRegistro
        show={showAnimacionRegistro}
        onHide={() => setShowAnimacionRegistro(false)}
        tipo={libroEditado ? "editar" : "guardar"}
      />

      <ModalQR
        show={showQRModal}
        handleClose={handleCloseQRModal}
        qrUrl={selectedUrl}
      />
    </Container>
  );
};

export default Libros;