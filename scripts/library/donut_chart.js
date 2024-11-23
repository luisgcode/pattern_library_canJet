"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ DONUT CHART
// Datos del gráfico
const dataDonutChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsDonutChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthDonutChart = 400;
const heightDonutChart = 400;
const radiusDonutChart = Math.min(widthDonutChart, heightDonutChart) / 2;

// Seleccionar el SVG y agregar un grupo
const svgDonutChart = d3
  .select("#donut-chart")
  .append("g")
  .attr(
    "transform",
    `translate(${widthDonutChart / 2}, ${heightDonutChart / 2})`
  ); // Centrar el gráfico

// Crear el generador de segmentos
const donutPie = d3.pie().value((d) => d.value); // Usar el valor para el donut chart

const arcDonut = d3
  .arc()
  .innerRadius(radiusDonutChart * 0.4) // Radio interno para crear el efecto de donut
  .outerRadius(radiusDonutChart);

// Dibujar segmentos
const donutArcs = svgDonutChart
  .selectAll("arc")
  .data(donutPie(dataDonutChart))
  .enter()
  .append("g")
  .attr("class", "arc");

donutArcs
  .append("path")
  .attr("d", arcDonut)
  .attr("fill", (d, i) => colorsDonutChart[i]); // Asignar color a cada sección

// Leyenda
const legendDonutChart = svgDonutChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusDonutChart - 20}, ${-radiusDonutChart + 10})`
  ); // Ajustar posición de la leyenda

dataDonutChart.forEach((d, i) => {
  const legendRow = legendDonutChart
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsDonutChart[i]);

  legendRow
    .append("text")
    .attr("x", 20)
    .attr("y", 15) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendDonutChart");
});
