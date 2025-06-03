// src/i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    debug: true, // Puedes quitar esto en producción
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          menu: {
            inicio: 'Home',
            categorias: 'Categories',
            productos: 'Products',
            catalogo: 'Catalog',
            libros: 'Books',
            clima: 'Weather',
            pronunciacion: 'Pronunciation',
            estadisticas: 'Statistics',
            empleados: 'Employees',
            cerrarsesion: 'Logout',
            iniciarSesion: 'Login',
            idioma: 'Language',
            español: 'Spanish',
            ingles: 'English',
          },
        },
      },
      es: {
        translation: {
          menu: {
            inicio: 'Inicio',
            categorias: 'Categorías',
            productos: 'Productos',
            catalogo: 'Catálogo',
            libros: 'Libros',
            clima: 'Clima',
            pronunciacion: 'Pronunciación',
            estadisticas: 'Estadísticas',
            empleados: 'Empleados',
            cerrarsesion: 'Cerrar Sesión',
            iniciarSesion: 'Iniciar Sesión',
            idioma: 'Idioma',
            español: 'Español',
            ingles: 'Inglés',
          },
        },
      },
    },
  });

export default i18next;
