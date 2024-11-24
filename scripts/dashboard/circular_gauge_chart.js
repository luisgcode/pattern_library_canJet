"use strict";
// Variables for the circular gauge chart
// Variables para el gráfico circular
let salesForecastCircular = 45; // Current sales percentage towards the goal / Porcentaje actual de ventas hacia el objetivo
let forecastCircular = 1000000; // Maximum projected sales amount (in CAD) / Monto máximo de ventas proyectadas (en CAD)
let currentSalesCircular = (salesForecastCircular / 100) * forecastCircular; // Calculate the current sales amount based on the percentage / Calcula el monto actual de ventas basándose en el porcentaje

// Dimensions of the chart / Dimensiones del gráfico
const widthCircularGauge = 250; // Chart width in pixels / Ancho del gráfico en píxeles
const heightCircularGauge = 150; // Chart height in pixels / Alto del gráfico en píxeles
const radiusCircularGauge =
  Math.min(widthCircularGauge, heightCircularGauge) / 2 - 10; // Radius of the chart, adjusted to fit inside the SVG / Radio ajustado para que quepa en el SVG

// Select the HTML container for the chart and add a title / Seleccionar el contenedor HTML y agregar el título
const containerCircularGauge = d3.select("#circular-gauge-chart");

// Add a title above the chart / Agrega un título encima del gráfico
const titleTextCircular = containerCircularGauge
  .append("div")
  .style("text-align", "center")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text(`Profit Margin: $${forecastCircular.toLocaleString("en-CA")} CAD`); // Dynamic title / Título dinámico

// Create the SVG for the chart / Crear el SVG para el gráfico
const svgCircular = containerCircularGauge
  .append("svg")
  .attr("width", widthCircularGauge)
  .attr("height", heightCircularGauge)
  .style("display", "block")
  .style("margin", "0 auto") // Center the SVG horizontally / Centra el SVG horizontalmente
  .append("g")
  .attr(
    "transform",
    `translate(${widthCircularGauge / 2}, ${heightCircularGauge / 2})` // Position the chart at the center / Centrar el gráfico
  );

// Scale for the chart's angle / Escala para el ángulo del gráfico
const scaleCircular = d3
  .scaleLinear()
  .domain([0, 100]) // From 0% to 100% / De 0% a 100%
  .range([0, 2 * Math.PI]); // Full circle in radians / Círculo completo en radianes

// Background arc configuration / Configuración del arco de fondo
const backgroundArcCircular = d3
  .arc()
  .innerRadius(radiusCircularGauge - 20) // Inner radius of the arc / Radio interno
  .outerRadius(radiusCircularGauge) // Outer radius of the arc / Radio externo
  .startAngle(0) // Start at 0 degrees / Comienza en 0 grados
  .endAngle(2 * Math.PI); // Ends at 360 degrees / Termina en 360 grados

// Draw the background arc / Dibuja el arco de fondo
svgCircular
  .append("path")
  .attr("d", backgroundArcCircular)
  .attr("fill", "#e6e6e6"); // Gray background / Fondo gris

// Progress arc configuration / Configuración del arco de progreso
const valueArcCircular = d3
  .arc()
  .innerRadius(radiusCircularGauge - 20)
  .outerRadius(radiusCircularGauge)
  .startAngle(0);

// Progress arc (dynamic value) / Arco dinámico (valor actual)
const progressCircular = svgCircular
  .append("path")
  .datum({ endAngle: scaleCircular(0) }) // Starts at 0 progress / Comienza en 0 progreso
  .attr("d", valueArcCircular)
  .attr("fill", "#ff4d52"); // Initial color / Color inicial

// Add percentage text in the center / Agrega el texto del porcentaje en el centro
const percentageTextCircular = svgCircular
  .append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "5px")
  .style("font-size", "14px")
  .style("fill", "#333")
  .text(`${salesForecastCircular}%`); // Display the current percentage / Muestra el porcentaje actual

// Toggle between percentage and amount / Alternar entre porcentaje y monto
let showPercentage = true;

// Add a toggle button / Agrega un botón para alternar
containerCircularGauge
  .insert("button", ":first-child") // Insert button above the chart / Inserta el botón encima del gráfico
  .text(" $ ") // Initial button text / Texto inicial del botón
  .style("position", "absolute")
  .style("font-size", "16px")
  .style("cursor", "pointer")
  .on("click", function () {
    showPercentage = !showPercentage; // Toggle the state / Alterna el estado
    this.textContent = showPercentage ? " $ " : " % "; // Update button text / Actualiza el texto del botón
    updateCircularGaugeChart(salesForecastCircular, forecastCircular); // Update the chart / Actualiza el gráfico
  });

// Update chart function / Función para actualizar el gráfico
function updateCircularGaugeChart(salesForecastCircular, forecastCircular) {
  const newSalesCircular = (salesForecastCircular / 100) * forecastCircular; // Calculate sales amount / Calcula el monto de ventas

  titleTextCircular.text(`Gross Revenue`); // Update the title / Actualiza el título

  percentageTextCircular.text(
    showPercentage
      ? `${salesForecastCircular}%`
      : `$${newSalesCircular.toLocaleString("en-CA")} CAD`
  ); // Update text / Actualiza el texto

  // Animate the progress arc / Anima el arco de progreso
  progressCircular
    .transition()
    .duration(2000) // Animation duration / Duración de la animación
    .attrTween("d", function (d) {
      const interpolate = d3.interpolate(
        d.endAngle,
        scaleCircular(salesForecastCircular)
      ); // Smooth transition / Transición suave
      return function (t) {
        d.endAngle = interpolate(t);
        return valueArcCircular(d);
      };
    });
}

// Initialize the chart / Inicializa el gráfico
updateCircularGaugeChart(salesForecastCircular, forecastCircular);
