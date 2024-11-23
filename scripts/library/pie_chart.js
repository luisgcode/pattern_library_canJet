"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ PIE CHART
// Datos del gráfico
const dataPieChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsPieChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthPieChart = 400;
const heightPieChart = 400;
const radiusPieChart = Math.min(widthPieChart, heightPieChart) / 2;

// Seleccionar el SVG y agregar un grupo
const svgPieChart = d3
  .select("#pie-chart")
  .append("g")
  .attr("transform", `translate(${widthPieChart / 2}, ${heightPieChart / 2})`); // Centrar el gráfico

// Crear el generador de segmentos
const pie = d3.pie().value((d) => d.value); // Usar el valor para el pie chart

const arc = d3
  .arc()
  .innerRadius(0) // Para gráfico de pastel, el radio interno es 0
  .outerRadius(radiusPieChart);

// Dibujar segmentos
const arcs = svgPieChart
  .selectAll("arc")
  .data(pie(dataPieChart))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs
  .append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => colorsPieChart[i]); // Asignar color a cada sección

// Leyenda
const legendPieChart = svgPieChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusPieChart - 20}, ${-radiusPieChart + 10})`
  ); // Ajustar posición de la leyenda

dataPieChart.forEach((d, i) => {
  const legendRow = legendPieChart
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsPieChart[i]);

  legendRow
    .append("text")
    .attr("x", 20)
    .attr("y", 15) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendPieChart");
});
