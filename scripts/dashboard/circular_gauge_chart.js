"use strict";

// Variables del gráfico circular
let salesForecastCircular = 45; // Porcentaje de ventas actuales con respecto al objetivo
let forecastCircular = 1000000; // Monto máximo de ventas proyectadas (en CAD)
let currentSalesCircular = (salesForecastCircular / 100) * forecastCircular; // Calcula el monto actual de ventas basándose en el porcentaje

const widthCircularGauge = 250; // Ancho del gráfico en píxeles
const heightCircularGauge = 150; // Alto del gráfico en píxeles
const radiusCircularGauge =
  Math.min(widthCircularGauge, heightCircularGauge) / 2 - 10; // Define el radio del gráfico, ajustado para que quepa en el SVG

// Seleccionar el contenedor HTML donde se agregará el gráfico y el título
const containerCircularGauge = d3.select("#circular-gauge-chart");

// Agregar el título del gráfico en el contenedor
const titleTextCircular = containerCircularGauge
  .append("div")
  .style("text-align", "center")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text(`Profit Margin: $${forecastCircular.toLocaleString("en-CA")} CAD`); // Actualizar título dinámico

// Crear el SVG centrado donde se dibujará el gráfico
const svgCircular = containerCircularGauge
  .append("svg")
  .attr("width", widthCircularGauge)
  .attr("height", heightCircularGauge)
  .style("display", "block")
  .style("margin", "0 auto")
  .append("g")
  .attr(
    "transform",
    `translate(${widthCircularGauge / 2}, ${heightCircularGauge / 2})`
  );

// Escala para el ángulo del gráfico
const scaleCircular = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, 2 * Math.PI]);

// Configuración del arco de fondo
const backgroundArcCircular = d3
  .arc()
  .innerRadius(radiusCircularGauge - 20)
  .outerRadius(radiusCircularGauge)
  .startAngle(0)
  .endAngle(2 * Math.PI);

// Dibuja el fondo del gráfico circular (circular gris)
svgCircular
  .append("path")
  .attr("d", backgroundArcCircular)
  .attr("fill", "#e6e6e6");

// Configuración del arco de valor actual (progreso)
const valueArcCircular = d3
  .arc()
  .innerRadius(radiusCircularGauge - 20)
  .outerRadius(radiusCircularGauge)
  .startAngle(0);

// Arco que representa el valor actual (progreso)
const progressCircular = svgCircular
  .append("path")
  .datum({ endAngle: scaleCircular(0) }) // Comienza desde 0
  .attr("d", valueArcCircular)
  .attr("fill", "#ff4d52");

// Agregar etiquetas de porcentaje
const percentageTextCircular = svgCircular
  .append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "5px")
  .style("font-size", "14px")
  .style("fill", "#333")
  .text(`${salesForecastCircular}%`);

// Variable para alternar entre porcentaje y monto
let showPercentage = true;

// Agregar botón de alternancia y posicionarlo encima del gráfico
containerCircularGauge
  .insert("button", ":first-child") // Inserta el botón antes del primer hijo del contenedor
  .text(" $ ")
  .style("position", "absolute")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .style("cursor", "pointer")
  .style("background", "none") // Elimina el fondo del botón
  .style("border", "none") // Elimina el borde
  .style("color", "#333") // Define el color del texto
  .style("font-weight", "bold") // Opcional: hace el texto más visible
  .style("top", "20px") // Ajusta la posición vertical del botón
  .on("click", function () {
    showPercentage = !showPercentage;
    this.textContent = showPercentage ? " $ " : " % ";
    updateCircularGaugeChart(salesForecastCircular, forecastCircular);
  });

// Función para actualizar el gráfico
function updateCircularGaugeChart(salesForecastCircular, forecastCircular) {
  // Calcular el nuevo porcentaje y el monto de ventas actual
  const newSalesCircular = (salesForecastCircular / 100) * forecastCircular;

  // Actualizar el título con el monto total de forecast
  titleTextCircular.text(`Gross Revenue`);

  // Actualizar los textos de porcentaje o monto según el estado
  percentageTextCircular.text(
    showPercentage
      ? `${salesForecastCircular}%`
      : `$${newSalesCircular.toLocaleString("en-CA")}  `
  );

  // Actualizar el arco de progreso con animación
  progressCircular
    .transition()
    .duration(2000) // Duración de la animación
    .attrTween("d", function (d) {
      const interpolate = d3.interpolate(
        d.endAngle,
        scaleCircular(salesForecastCircular)
      ); // Interpolación de la transición
      return function (t) {
        d.endAngle = interpolate(t);
        return valueArcCircular(d);
      };
    });
}

// Inicializar el gráfico circular con los valores iniciales con animación en la primera carga
updateCircularGaugeChart(salesForecastCircular, forecastCircular);
