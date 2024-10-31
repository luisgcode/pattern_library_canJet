"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART
// Definir el tamaño del gráfico y los márgenes
const baseWidthBarChart = 750; // Ancho total del gráfico
const baseHeighBarChart = 400; // Alto total del gráfico
const marginBarChart = { top: 20, right: 30, bottom: 30, left: 40 }; // Márgenes

// Datos para el gráfico de barras
const dataBarChart = [
  { city: "London", value: 10000 },
  { city: "Toronto", value: 20000 },
  { city: "New York", value: 30000 },
  { city: "Tokyo", value: 40000 },
  { city: "Berlin", value: 30000 },
];

// Crear escalas
const xBar = d3
  .scaleBand()
  .domain(dataBarChart.map((d) => d.city))
  .range([marginBarChart.left, baseWidthBarChart - marginBarChart.right])
  .padding(0.1); // Espaciado entre las barras

const yBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataBarChart, (d) => d.value)]) // Valor máximo del eje Y
  .nice() // Mejora la escala de los valores
  .range([baseHeighBarChart - marginBarChart.bottom, marginBarChart.top]);

// Seleccionar el SVG para el gráfico de barras
const svgBar = d3
  .select("#bar-chart")
  .attr("width", baseWidthBarChart)
  .attr("height", baseHeighBarChart);

// Dibujar las barras
svgBar
  .selectAll(".bar")
  .data(dataBarChart)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xBar(d.city))
  .attr("y", (d) => yBar(d.value))
  .attr("width", xBar.bandwidth())
  .attr(
    "height",
    (d) => baseHeighBarChart - marginBarChart.bottom - yBar(d.value)
  )
  .attr("fill", "#4d52ff"); // Color de las barras

// Eje X para el gráfico de barras
svgBar
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeighBarChart - marginBarChart.bottom})`
  )
  .call(d3.axisBottom(xBar));

// Eje Y para el gráfico de barras
svgBar
  .append("g")
  .attr("transform", `translate(${marginBarChart.left},0)`)
  .call(d3.axisLeft(yBar));
