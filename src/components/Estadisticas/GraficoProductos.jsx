import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficosProductos = ({ nombres, precios }) => {
  // Limitar a un máximo de 10 productos para evitar sobrecarga
  const maxItems = 10;
  const limitedNombres = nombres.slice(0, maxItems);
  const limitedPrecios = precios.slice(0, maxItems);

  const data = {
    labels: limitedNombres,
    datasets: [
      {
        label: 'Precio (C$)',
        data: limitedPrecios,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Precios de Productos',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: C$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Precio (C$)',
        },
        ticks: {
          callback: (value) => `C$${value.toFixed(2)}`, // Formato de moneda
        },
      },
      x: {
        title: {
          display: true,
          text: 'Productos',
        },
        ticks: {
          maxRotation: 45, // Rotar labels para evitar superposición
          minRotation: 45,
          autoSkip: true, // Omitir labels si hay demasiados
          maxTicksLimit: 10, // Limitar número de ticks en el eje X
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Card>
        <Card.Body>
          <Card.Title>Gráfico de Productos</Card.Title>
          <div style={{ height: '350px' }}>
            <Bar data={data} options={options} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GraficosProductos;