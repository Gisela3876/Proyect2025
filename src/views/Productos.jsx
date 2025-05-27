import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Col } from "react-bootstrap";
import { db } from "../assets/database/firebaseconfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import TablaProductos from "../components/Productos/TablaProductos";
import ModalRegistroProducto from "../components/Productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/Productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/Productos/ModalEliminacionProducto";
import AnimacionEliminacion from "../components/Productos/AnimacionEliminacion";
import { useAuth } from "../assets/database/authcontext";
import { useNavigate } from "react-router-dom";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnimacionEliminacion, setShowAnimacionEliminacion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    precio: "",
    categoria: "",
    imagen: "",
  });
  const [productoEditado, setProductoEditado] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");

  const handleAddProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar un producto.");
      navigate("/login");
      return;
    }

    if (
      !nuevoProducto.nombreProducto ||
      !nuevoProducto.precio ||
      !nuevoProducto.categoria
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (isNaN(nuevoProducto.precio) || nuevoProducto.precio <= 0) {
      alert("El precio debe ser un número válido mayor a 0.");
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(productosCollection, {
        ...nuevoProducto,
        precio: parseFloat(nuevoProducto.precio),
      });
      setShowModal(false);
      setNuevoProducto({
        nombreProducto: "",
        precio: "",
        categoria: "",
        imagen: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar el producto. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para editar un producto.");
      navigate("/login");
      return;
    }

    if (
      !productoEditado.nombreProducto ||
      !productoEditado.precio ||
      !productoEditado.categoria
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (isNaN(productoEditado.precio) || productoEditado.precio <= 0) {
      alert("El precio debe ser un número válido mayor a 0.");
      return;
    }

    setIsLoading(true);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, {
        ...productoEditado,
        precio: parseFloat(productoEditado.precio),
      });
      setShowEditModal(false);
      await fetchData();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar el producto. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProducto = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para eliminar un producto.");
      navigate("/login");
      return;
    }

    if (productoAEliminar) {
      try {
        setShowAnimacionEliminacion(true);
        const productoRef = doc(db, "productos", productoAEliminar.id);
        await deleteDoc(productoRef);
        setShowDeleteModal(false);
        await fetchData();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto. Por favor, intenta de nuevo.");
      } finally {
        setShowAnimacionEliminacion(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const openEditModal = (producto) => {
    setProductoEditado(producto);
    setShowEditModal(true);
  };

  const openDeleteModal = (producto) => {
    setProductoAEliminar(producto);
    setShowDeleteModal(true);
  };

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(productosCollection);
      const fetchedProductos = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductos(fetchedProductos);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("Error al obtener los productos. Por favor, intenta de nuevo.");
    }
  }, [productosCollection]);

  const fetchCategorias = useCallback(async () => {
    try {
      const categoriasData = await getDocs(categoriasCollection);
      const fetchedCategorias = categoriasData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategorias(fetchedCategorias);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      alert("Error al obtener las categorías. Por favor, intenta de nuevo.");
    }
  }, [categoriasCollection]);

  useEffect(() => {
    const cargarDatos = async () => {
      await fetchData();
      await fetchCategorias();
    };
    cargarDatos();
  }, [fetchData, fetchCategorias]);

  useEffect(() => {
    const filtered = searchTerm.trim()
      ? productos.filter((producto) =>
          producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : productos;
    setFilteredProductos(filtered);
  }, [searchTerm, productos]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generarReportePDF = () => {
    if (filteredProductos.length === 0) {
      alert("No hay productos para generar el reporte.");
      return;
    }

    const doc = new jsPDF();
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.width / 2, 18, { align: "center" });

    const columns = ["#", "Nombre", "Precio", "Categoría"];
    const filas = filteredProductos.map((producto, index) => [
      index + 1,
      producto.nombreProducto,
      `C$ ${parseFloat(producto.precio).toFixed(2)}`,
      producto.categoria,
    ]);

    autoTable(doc, {
      head: [columns],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 40, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
        3: { cellWidth: 50 },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageNumber = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      },
    });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}-${mes}-${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const exportarExcelProductos = () => {
    if (filteredProductos.length === 0) {
      alert("No hay productos para generar el reporte Excel.");
      return;
    }

    try {
      const datos = filteredProductos.map((producto, index) => ({
        "#": index + 1,
        Nombre: producto.nombreProducto,
        Precio: parseFloat(producto.precio).toFixed(2),
        Categoría: producto.categoria,
      }));

      const hoja = XLSX.utils.json_to_sheet(datos);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

      const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

      const fecha = new Date();
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      const nombreArchivo = `productos_${dia}-${mes}-${anio}.xlsx`;

      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, nombreArchivo);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert("Error al generar el archivo Excel. Por favor, intenta de nuevo.");
    }
  };

  const generarPDFDetalleProducto = (producto) => {
    try {
      const pdf = new jsPDF();

      // Encabezado
      pdf.setFillColor(28, 41, 51);
      pdf.rect(0, 0, 210, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text(producto.nombreProducto, pdf.internal.pageSize.getWidth() / 2, 18, { align: "center" });

      // Imagen centrada (si existe)
      if (producto.imagen) {
        try {
          const propiedadesImagen = pdf.getImageProperties(producto.imagen);
          const anchoPagina = pdf.internal.pageSize.getWidth();
          const anchoImagen = 60;
          const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
          const posicionX = (anchoPagina - anchoImagen) / 2;
          pdf.addImage(producto.imagen, 'JPEG', posicionX, 40, anchoImagen, altoImagen);
          // Ajustar posición Y para el texto debajo de la imagen
          const posicionY = 40 + altoImagen + 10;
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(14);
          pdf.text(`Precio: C$ ${parseFloat(producto.precio).toFixed(2)}`, anchoPagina / 2, posicionY, { align: "center" });
          pdf.text(`Categoría: ${producto.categoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
        } catch (error) {
          console.error("Error al cargar la imagen en el PDF:", error);
          // Si hay un error con la imagen, mostrar los datos sin ella
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(14);
          pdf.text(`Precio: C$ ${parseFloat(producto.precio).toFixed(2)}`, pdf.internal.pageSize.getWidth() / 2, 50, { align: "center" });
          pdf.text(`Categoría: ${producto.categoria}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        }
      } else {
        // Si no hay imagen, mostrar los datos más arriba
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.text(`Precio: C$ ${parseFloat(producto.precio).toFixed(2)}`, pdf.internal.pageSize.getWidth() / 2, 50, { align: "center" });
        pdf.text(`Categoría: ${producto.categoria}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: "center" });
      }

      pdf.save(`${producto.nombreProducto}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF del producto:", error);
      alert("Error al generar el PDF del producto. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Container className="mt-5">
      <br />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        {isLoggedIn && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Producto
          </Button>
        )}
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={generarReportePDF}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelProductos}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </div>

      <CuadroBusquedas
        searchText={searchTerm}
        handleSearchChange={handleSearchChange}
        placeholder="Buscar producto por nombre, categoría o precio..."
      />

      <TablaProductos
        productos={paginatedProductos}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        generarPDFDetalleProducto={generarPDFDetalleProducto} // Pasar la función a TablaProductos
      />

      <Paginacion
        itemsPerPage={itemsPerPage}
        totalItems={filteredProductos.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <ModalRegistroProducto
        showModal={showModal}
        setShowModal={setShowModal}
        nuevoProducto={nuevoProducto}
        handleInputChange={handleInputChange}
        handleAddProducto={handleAddProducto}
        categorias={categorias}
        isLoading={isLoading}
      />
      <ModalEdicionProducto
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        productoEditado={productoEditado}
        setProductoEditado={setProductoEditado}
        handleEditInputChange={handleEditInputChange}
        handleEditProducto={handleEditProducto}
        categorias={categorias}
        isLoading={isLoading}
      />
      <ModalEliminacionProducto
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleDeleteProducto={handleDeleteProducto}
      />
      <AnimacionEliminacion
        show={showAnimacionEliminacion}
        onHide={() => setShowAnimacionEliminacion(false)}
      />
    </Container>
  );
};

export default Productos;