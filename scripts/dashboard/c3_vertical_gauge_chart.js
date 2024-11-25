"use strict";

// Variables del gráfico / Chart variables
let salesForecastValue = 45.6; // Porcentaje de ventas actuales con respecto al objetivo / Current sales percentage vs target
let forecastValue = 200000; // Monto máximo de ventas proyectadas (en CAD) / Maximum projected sales amount (in CAD)
let currentSalesValue = (salesForecastValue / 100) * forecastValue; // Calcula el monto actual de ventas basándose en el porcentaje / Calculates current sales amount based on the percentage

const widthValue = 250; // Ancho del gráfico / Chart width
const heightValue = 60; // Alto del gráfico / Chart height

// Seleccionar el contenedor HTML donde se agregará el gráfico y el título / Select the HTML container for the chart and title
const containerValue = d3.select("#vertical-gauge-chart");

// Agregar el título del gráfico en el contenedor / Add the chart title inside the container
const titleTextValue = containerValue
  .append("div")
  .style("text-align", "center")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text("Sales Performance"); // Título del gráfico / Chart title

// Crear el SVG donde se dibujará el gráfico / Create the SVG to draw the chart
const svgValue = containerValue
  .append("svg")
  .attr("width", widthValue)
  .attr("height", heightValue)
  .style("display", "block")
  .style("margin", "0 auto");

// Borde de la barra de progreso / Border of the progress bar
svgValue
  .append("rect")
  .attr("x", 50)
  .attr("y", heightValue / 2 - 20)
  .attr("width", widthValue - 100) // Ancho de la barra con espacio para el borde / Width of the bar with space for the border
  .attr("height", 20)
  .attr("fill", "none") // No tiene color de fondo / No background color
  .attr("stroke", "#d0d0d0") // Color del borde / Border color
  .attr("stroke-width", 1); // Grosor del borde / Border thickness

// Barra de progreso (representando el porcentaje de ventas alcanzado) / Progress bar (representing sales percentage achieved)
const progressBar = svgValue
  .append("rect")
  .attr("x", 50)
  .attr("y", heightValue / 2 - 20) // Posicionando verticalmente en el centro / Positioning vertically at the center
  .attr("width", 0) // Ancho inicial en 0, será actualizado más tarde / Initial width set to 0, will be updated later
  .attr("height", 20)
  .attr("fill", "#ff4d52"); // Color de la barra de progreso / Progress bar color

// Texto con el porcentaje / Percentage text
const percentageTextValue = svgValue
  .append("text")
  .attr("x", widthValue / 2)
  .attr("y", heightValue / 2 + -4)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "#333")
  .text(`${salesForecastValue}%`);

// Texto con el monto actual de ventas / Text showing the current sales amount
const salesTextValue = svgValue
  .append("text")
  .attr("x", widthValue / 2)
  .attr("y", heightValue / 2 + 25) // Aumentar el valor de Y para agregar espacio / Increase Y value to add space
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "#555")
  .text(`$${currentSalesValue.toLocaleString("en-CA")} CAD`); // Muestra el monto actual de ventas con formato / Shows the current sales amount with formatting

// Función para actualizar el gráfico / Function to update the chart
function updateSingleValueChart(salesForecastValue, forecastValue) {
  // Calcular el nuevo monto de ventas / Calculate the new sales amount
  const newSalesValue = (salesForecastValue / 100) * forecastValue;

  // Actualizar el porcentaje de ventas alcanzadas / Update the sales percentage text
  percentageTextValue.text(`${salesForecastValue}%`);

  // Actualizar el monto actual de ventas / Update the current sales amount text
  salesTextValue.text(`$${newSalesValue.toLocaleString("en-CA")} CAD`);

  // Actualizar la barra de progreso con animación / Update the progress bar with animation
  progressBar
    .transition()
    .duration(2000) // Duración de la animación / Animation duration
    .attr("width", (salesForecastValue / 100) * (widthValue - 100)); // Progreso basado en el porcentaje / Progress based on the percentage
}

// Inicializar el gráfico con los valores iniciales / Initialize the chart with initial values
updateSingleValueChart(salesForecastValue, forecastValue);
