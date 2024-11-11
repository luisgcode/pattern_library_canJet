"use strict";

// Variables del gráfico
let salesForecastGauge = 50; // Porcentaje de ventas actuales con respecto al objetivo
let forecastGauge = 4000000; // Monto máximo de ventas proyectadas (en CAD)
let currentSalesGauge = (salesForecastGauge / 100) * forecastGauge; // Calcula el monto actual de ventas basándose en el porcentaje

const widthGauge = 200; // Ancho del gráfico en píxeles
const heightGauge = 240; // Alto del gráfico en píxeles
const radiusGauge = Math.min(widthGauge, heightGauge) / 2 - 10; // Define el radio del gráfico, ajustado para que quepa en el SVG

// Seleccionar el contenedor HTML donde se agregará el gráfico y el título
const containerGauge = d3.select("#gauge-chart");

// Agregar el título del gráfico en el contenedor
const titleTextGauge = containerGauge
  .append("div")
  .style("text-align", "center")
  .style("font-size", "14px")
  .text(`Sales Forecast: $${forecastGauge.toLocaleString("en-CA")} CAD`); // Actualizar título dinámico

// Crear el SVG centrado donde se dibujará el gráfico
const svgGauge = containerGauge
  .append("svg")
  .attr("width", widthGauge)
  .attr("height", heightGauge)
  .style("display", "block")
  .style("margin", "0 auto")
  .append("g")
  .attr("transform", `translate(${widthGauge / 2}, ${heightGauge / 2})`);

// Escala para el ángulo del gráfico
const scaleGauge = d3
  .scaleLinear()
  .domain([0, 100])
  .range([-Math.PI / 2, Math.PI / 2]);

// Configuración del arco de fondo
const backgroundArcGauge = d3
  .arc()
  .innerRadius(radiusGauge - 20)
  .outerRadius(radiusGauge)
  .startAngle(-Math.PI / 2)
  .endAngle(Math.PI / 2);

// Dibuja el fondo del gauge (semicírculo gris)
svgGauge.append("path").attr("d", backgroundArcGauge).attr("fill", "#e6e6e6");

// Configuración del arco de valor actual (progreso)
const valueArcGauge = d3
  .arc()
  .innerRadius(radiusGauge - 20)
  .outerRadius(radiusGauge)
  .startAngle(-Math.PI / 2);

// Arco que representa el valor actual (progreso)
const progressGauge = svgGauge
  .append("path")
  .datum({ endAngle: scaleGauge(0) }) // Comienza desde 0
  .attr("d", valueArcGauge)
  .attr("fill", "#4CAF50");

// Configuración de la aguja
const needleGauge = svgGauge
  .append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", -radiusGauge + 25) // Use radiusGauge here
  .attr("stroke", "red")
  .attr("stroke-width", 3);

// Agregar etiquetas de porcentaje y ventas actuales
const percentageTextGauge = svgGauge
  .append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "-2em")
  .style("font-size", "16px")
  .style("fill", "#333");

const salesTextGauge = svgGauge
  .append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "1.5em")
  .style("font-size", "12px")
  .style("fill", "#555");

// Variable para almacenar el último ángulo de la aguja
let lastAngleGauge = scaleGauge(salesForecastGauge);

// Función para actualizar el gráfico
function updateGaugeChart(salesForecastGauge, forecastGauge) {
  // Calcular el nuevo porcentaje y el monto de ventas actual
  const newSalesGauge = (salesForecastGauge / 100) * forecastGauge;
  const newAngleGauge = scaleGauge(salesForecastGauge);

  // Actualizar el título con el monto total de forecast
  titleTextGauge.text(
    `Sales Forecast: $${forecastGauge.toLocaleString("en-CA")} CAD`
  );

  // Actualizar el arco de progreso con animación
  progressGauge
    .transition()
    .duration(2000) // Duración de la animación
    .attrTween("d", function (d) {
      const interpolate = d3.interpolate(d.endAngle, newAngleGauge); // Interpolación de la transición
      return function (t) {
        d.endAngle = interpolate(t);
        return valueArcGauge(d);
      };
    });

  // Actualizar la aguja con animación
  needleGauge
    .transition()
    .duration(2000)
    .attrTween("transform", function () {
      const interpolate = d3.interpolate(lastAngleGauge, newAngleGauge); // Interpolación de la aguja
      lastAngleGauge = newAngleGauge; // Actualiza el último ángulo después de la transición
      return function (t) {
        const angle = interpolate(t);
        return `rotate(${angle * (180 / Math.PI)})`; // Ajuste a grados
      };
    });

  // Actualizar los textos de porcentaje y ventas actuales
  percentageTextGauge.text(`${salesForecastGauge}%`);
  salesTextGauge.text(`$${newSalesGauge.toLocaleString("en-CA")} CAD`);
}

// Inicializar el gráfico con los valores iniciales con animación en la primera carga
updateGaugeChart(salesForecastGauge, forecastGauge);
