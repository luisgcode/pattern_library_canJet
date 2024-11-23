"use strict";

// Variables del gráfico
let salesForecastValue = 45.6; // Porcentaje de ventas actuales con respecto al objetivo
let forecastValue = 200000; // Monto máximo de ventas proyectadas (en CAD)
let currentSalesValue = (salesForecastValue / 100) * forecastValue; // Calcula el monto actual de ventas basándose en el porcentaje

const widthValue = 250; // Ancho del gráfico
const heightValue = 60; // Alto del gráfico

// Seleccionar el contenedor HTML donde se agregará el gráfico y el título
const containerValue = d3.select("#vertical-gauge-chart");

// Agregar el título del gráfico en el contenedor
const titleTextValue = containerValue
  .append("div")
  .style("text-align", "center")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Sales Performance"); // Título del gráfico

// Crear el SVG donde se dibujará el gráfico
const svgValue = containerValue
  .append("svg")
  .attr("width", widthValue)
  .attr("height", heightValue)
  .style("display", "block")
  .style("margin", "0 auto");

// Borde de la barra de progreso
svgValue
  .append("rect")
  .attr("x", 50)
  .attr("y", heightValue / 2 - 20)
  .attr("width", widthValue - 100) // Ancho de la barra con espacio para el borde
  .attr("height", 20)
  .attr("fill", "none") // No tiene color de fondo
  .attr("stroke", "#d0d0d0") // Color del borde
  .attr("stroke-width", 1); // Grosor del borde

// Barra de progreso (representando el porcentaje de ventas alcanzado)
const progressBar = svgValue
  .append("rect")
  .attr("x", 50)
  .attr("y", heightValue / 2 - 20) // Posicionando verticalmente en el centro
  .attr("width", 0) // Ancho inicial en 0, será actualizado más tarde
  .attr("height", 20)
  .attr("fill", "#ff4d52");

// Texto con el porcentaje
const percentageTextValue = svgValue
  .append("text")
  .attr("x", widthValue / 2)
  .attr("y", heightValue / 2 + -4)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("fill", "#333")
  .text(`${salesForecastValue}%`);

// Texto con el monto actual de ventas
const salesTextValue = svgValue
  .append("text")
  .attr("x", widthValue / 2)
  .attr("y", heightValue / 2 + 25) // Aumentar el valor de Y para agregar espacio
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("fill", "#555")
  .text(`$${currentSalesValue.toLocaleString("en-CA")} CAD`);

// Función para actualizar el gráfico
function updateSingleValueChart(salesForecastValue, forecastValue) {
  // Calcular el nuevo monto de ventas
  const newSalesValue = (salesForecastValue / 100) * forecastValue;

  // Actualizar el porcentaje de ventas alcanzadas
  percentageTextValue.text(`${salesForecastValue}%`);

  // Actualizar el monto actual de ventas
  salesTextValue.text(`$${newSalesValue.toLocaleString("en-CA")} CAD`);

  // Actualizar la barra de progreso con animación
  progressBar
    .transition()
    .duration(2000) // Duración de la animación
    .attr("width", (salesForecastValue / 100) * (widthValue - 100)); // Progreso basado en el porcentaje
}

// Inicializar el gráfico con los valores iniciales
updateSingleValueChart(salesForecastValue, forecastValue);
