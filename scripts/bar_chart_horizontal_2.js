"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART HORIZONTAL
// Definir el tamaño del gráfico y los márgenes
const baseWidthHorizontalBarChart = 750; // Ancho total del gráfico
const baseHeightHorizontalBarChart = 400; // Alto total del gráfico
const marginHorizontalBarChart = { top: 20, right: 30, bottom: 30, left: 100 }; // Márgenes

// Datos para el gráfico de barras horizontales (pasajeros por tipo de vuelo)
const dataHorizontalBarChart = [
  { flightType: "Charter", passengers: 30000 },
  { flightType: "International", passengers: 20000 },
  { flightType: "Domestic", passengers: 40000 },
];

// Crear escalas para el eje Y y X
const yHorizontalBar = d3
  .scaleBand()
  .domain(dataHorizontalBarChart.map((d) => d.flightType))
  .range([
    marginHorizontalBarChart.top,
    baseHeightHorizontalBarChart - marginHorizontalBarChart.bottom,
  ])
  .padding(0.1);

const xHorizontalBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataHorizontalBarChart, (d) => d.passengers)]) // Valor máximo del eje X
  .range([
    marginHorizontalBarChart.left,
    baseWidthHorizontalBarChart - marginHorizontalBarChart.right,
  ]);

// Seleccionar el SVG para el gráfico de barras horizontales
const svgHorizontalBar = d3
  .select("#bar-chart-horizontal")
  .attr("width", baseWidthHorizontalBarChart)
  .attr("height", baseHeightHorizontalBarChart);

// Dibujar las barras
svgHorizontalBar
  .selectAll(".bar")
  .data(dataHorizontalBarChart)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("y", (d) => yHorizontalBar(d.flightType))
  .attr("x", marginHorizontalBarChart.left) // Comienza desde el margen izquierdo
  .attr("height", yHorizontalBar.bandwidth())
  .attr(
    "width",
    (d) => xHorizontalBar(d.passengers) - marginHorizontalBarChart.left
  ) // Ajustar el ancho
  .attr("fill", "#4d52ff"); // Color de las barras

// Eje Y para el gráfico de barras horizontales
svgHorizontalBar
  .append("g")
  .attr("transform", `translate(${marginHorizontalBarChart.left}, 0)`) // Mantener el eje Y dentro de los márgenes
  .call(d3.axisLeft(yHorizontalBar));

// Eje X para el gráfico de barras horizontales
svgHorizontalBar
  .append("g")
  .attr(
    "transform",
    `translate(0, ${
      baseHeightHorizontalBarChart - marginHorizontalBarChart.bottom
    })`
  )
  .call(
    d3
      .axisBottom(xHorizontalBar)
      .ticks(10)
      .tickFormat((d) => `${d}`)
  ); // Formatear ticks
