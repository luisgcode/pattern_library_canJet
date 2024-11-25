"use strict";

// Variables for the chart / Variables del gráfico
let salesForecastGauge = 70; // Current sales percentage relative to the goal / Porcentaje de ventas actuales con respecto al objetivo
let forecastGauge = 4000000; // Maximum projected sales amount (in CAD) / Monto máximo de ventas proyectadas (en CAD)
let currentSalesGauge = (salesForecastGauge / 100) * forecastGauge; // Calculate current sales amount based on the percentage / Calcula el monto actual de ventas basándose en el porcentaje

const widthGauge = 250; // Chart width in pixels / Ancho del gráfico en píxeles
const heightGauge = 210; // Chart height in pixels / Alto del gráfico en píxeles
const radiusGauge = Math.min(widthGauge, heightGauge) / 2; // Base radius for the chart / Define el radio base del gráfico

// Adjust arc thickness by setting inner and outer radii
// Aumentar el grosor del arco ajustando los radios
const innerRadius = radiusGauge - 20; // Inner radius (smaller) / Radio interno (más pequeño)
const outerRadius = radiusGauge; // Outer radius (larger) / Radio externo (más grande)

// Select the HTML container for the chart and title
// Seleccionar el contenedor HTML donde se agregará el gráfico y el título
const containerGauge = d3.select("#gauge-chart");

// Add the chart title to the container
// Agregar el título del gráfico en el contenedor
const titleTextGauge = containerGauge
  .append("div")
  .style("text-align", "center")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text(`Sales Forecast: $${forecastGauge.toLocaleString("en-CA")} CAD`); // Update dynamic title / Actualizar título dinámico

// Create a centered SVG for the chart
// Crear el SVG centrado donde se dibujará el gráfico
const svgGauge = containerGauge
  .append("svg")
  .attr("width", widthGauge) // Set width / Definir ancho
  .attr("height", heightGauge) // Set height / Definir altura
  .style("display", "block")
  .style("margin", "10px 0 0 0")
  .append("g")
  .attr("transform", `translate(${widthGauge / 2}, ${heightGauge / 2})`); // Center the SVG / Centrar el SVG

// Scale for the chart angle
// Escala para el ángulo del gráfico
const scaleGauge = d3
  .scaleLinear()
  .domain([0, 100]) // Input range (0% to 100%) / Rango de entrada (0% a 100%)
  .range([-Math.PI / 2, Math.PI / 2]); // Output range (half-circle) / Rango de salida (medio círculo)

// Background arc configuration
// Configuración del arco de fondo
const backgroundArcGauge = d3
  .arc()
  .innerRadius(innerRadius) // Use inner radius / Usar radio interno
  .outerRadius(outerRadius) // Use outer radius / Usar radio externo
  .startAngle(-Math.PI / 2) // Start angle (left edge) / Ángulo inicial (borde izquierdo)
  .endAngle(Math.PI / 2); // End angle (right edge) / Ángulo final (borde derecho)

// Draw the background arc (gray semicircle)
// Dibujar el fondo del gauge (semicírculo gris)
svgGauge.append("path").attr("d", backgroundArcGauge).attr("fill", "#e6e6e6");

// Current value arc configuration (progress arc)
// Configuración del arco de valor actual (progreso)
const valueArcGauge = d3
  .arc()
  .innerRadius(innerRadius) // Use inner radius / Usar radio interno
  .outerRadius(outerRadius) // Use outer radius / Usar radio externo
  .startAngle(-Math.PI / 2); // Start angle (left edge) / Ángulo inicial (borde izquierdo)

// Draw the progress arc
// Dibujar el arco de progreso
const progressGauge = svgGauge
  .append("path")
  .datum({ endAngle: scaleGauge(0) }) // Start from 0 / Comienza desde 0
  .attr("d", valueArcGauge)
  .attr("fill", "#ff4d52"); // Set color / Asignar color

// Needle configuration
// Configuración de la aguja
const needleGauge = svgGauge
  .append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", -innerRadius) // Extend needle to inner radius / Extender aguja hasta el radio interno
  .attr("stroke", "red") // Set color / Asignar color
  .attr("stroke-width", 2); // Set thickness / Asignar grosor

// Add percentage and current sales labels
// Agregar etiquetas de porcentaje y ventas actuales
const percentageTextGauge = svgGauge
  .append("text")
  .attr("text-anchor", "middle") // Center-align text / Centrar texto
  .attr("dy", "-2em") // Position above needle / Posicionar encima de la aguja
  .style("font-size", "14px") // Set font size / Asignar tamaño de fuente
  .style("fill", "#333"); // Set color / Asignar color

const salesTextGauge = svgGauge
  .append("text")
  .attr("text-anchor", "middle") // Center-align text / Centrar texto
  .attr("dy", "1.5em") // Position below needle / Posicionar debajo de la aguja
  .style("font-size", "14px")
  .style("fill", "#555");

// Store the last needle angle
// Variable para almacenar el último ángulo de la aguja
let lastAngleGauge = scaleGauge(salesForecastGauge);

// Function to update the chart
// Función para actualizar el gráfico
function updateGaugeChart(salesForecastGauge, forecastGauge) {
  const newSalesGauge = (salesForecastGauge / 100) * forecastGauge; // Calculate new sales amount / Calcular el nuevo monto de ventas
  const newAngleGauge = scaleGauge(salesForecastGauge); // Calculate new angle / Calcular el nuevo ángulo

  // Update the title with the total forecast amount
  // Actualizar el título con el monto total del forecast
  titleTextGauge.text(
    `Sales Forecast: $${forecastGauge.toLocaleString("en-CA")} CAD`
  );

  // Update the progress arc with animation
  // Actualizar el arco de progreso con animación
  progressGauge
    .transition()
    .duration(2000)
    .attrTween("d", function (d) {
      const interpolate = d3.interpolate(d.endAngle, newAngleGauge);
      return function (t) {
        d.endAngle = interpolate(t);
        return valueArcGauge(d);
      };
    });

  // Update the needle with animation
  // Actualizar la aguja con animación
  needleGauge
    .transition()
    .duration(2000)
    .attrTween("transform", function () {
      const interpolate = d3.interpolate(lastAngleGauge, newAngleGauge);
      lastAngleGauge = newAngleGauge; // Save the new angle / Guardar el nuevo ángulo
      return function (t) {
        const angle = interpolate(t);
        return `rotate(${angle * (180 / Math.PI)})`; // Convert angle to degrees / Convertir ángulo a grados
      };
    });

  // Update percentage and sales labels
  // Actualizar las etiquetas de porcentaje y ventas
  percentageTextGauge.text(`${salesForecastGauge}%`);
  salesTextGauge.text(`$${newSalesGauge.toLocaleString("en-CA")} CAD`);
}

// Initialize the chart with the initial values
// Inicializar el gráfico con los valores iniciales
updateGaugeChart(salesForecastGauge, forecastGauge);
