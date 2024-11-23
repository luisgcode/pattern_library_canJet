"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART STACKED
// Definir el tamaño del gráfico y los márgenes
const baseWidthStackedBarChart = 750; // Ancho total del gráfico
const baseHeightStackedBarChart = 400; // Alto total del gráfico
const marginStackedBarChart = { top: 20, right: 30, bottom: 30, left: 40 }; // Márgenes

// Datos para el gráfico de barras apiladas
const dataStackedBarChart = [
  { month: "January", firstClass: 1, business: 2, economy: 3 },
  { month: "February", firstClass: 1.5, business: 2.5, economy: 12.5 },
  { month: "March", firstClass: 2, business: 3, economy: 4 },
  { month: "April", firstClass: 2.5, business: 3.5, economy: 1.5 },
  { month: "May", firstClass: 3, business: 4, economy: 3 },
  { month: "June", firstClass: 1.5, business: 4.5, economy: 2.5 },
  { month: "July", firstClass: 4, business: 5, economy: 1 },
  { month: "August", firstClass: 1, business: 5, economy: 1 },
];

// Crear escalas para el eje X y Y
const xStackedBar = d3
  .scaleBand()
  .domain(dataStackedBarChart.map((d) => d.month))
  .range([
    marginStackedBarChart.left,
    baseWidthStackedBarChart - marginStackedBarChart.right,
  ])
  .padding(0.1);

const yStackedBar = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataStackedBarChart, (d) => d.firstClass + d.business + d.economy),
  ]) // Valor máximo del eje Y
  .range([
    baseHeightStackedBarChart - marginStackedBarChart.bottom,
    marginStackedBarChart.top,
  ]);

// Seleccionar el SVG para el gráfico de barras apiladas
const svgStackedBar = d3
  .select("#bar-chart-stacked")
  .attr("width", baseWidthStackedBarChart)
  .attr("height", baseHeightStackedBarChart);

// Apilar los datos
const stack = d3.stack().keys(["firstClass", "business", "economy"]);

const stackedData = stack(dataStackedBarChart);

// Dibujar las barras apiladas
svgStackedBar
  .selectAll(".layer")
  .data(stackedData)
  .enter()
  .append("g")
  .attr("class", "layer")
  .attr("fill", (d, i) => {
    const colors = ["#ff4d52", "#4d52ff", "#5bc0de"];
    return colors[i];
  })
  .selectAll("rect")
  .data((d) => d)
  .enter()
  .append("rect")
  .attr("x", (d) => xStackedBar(d.data.month))
  .attr("y", (d) => yStackedBar(d[1]))
  .attr("height", (d) => yStackedBar(d[0]) - yStackedBar(d[1]))
  .attr("width", xStackedBar.bandwidth());

// Eje X para el gráfico de barras apiladas
svgStackedBar
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightStackedBarChart - marginStackedBarChart.bottom})`
  )
  .call(d3.axisBottom(xStackedBar));

// Eje Y para el gráfico de barras apiladas
svgStackedBar
  .append("g")
  .attr("transform", `translate(${marginStackedBarChart.left},0)`)
  .call(
    d3
      .axisLeft(yStackedBar)
      .ticks(6)
      .tickFormat((d) => `${d}M`)
  ); // Formatear ticks como millones

// Leyenda
const legendBarChartStacked = svgStackedBar
  .append("g")
  .attr("transform", `translate(${baseWidthStackedBarChart - 120}, 20)`);

const categories = ["First Class", "Business", "Economy"];
const colors = ["#ff4d52", "#4d52ff", "#5bc0de"];

categories.forEach((category, index) => {
  legendBarChartStacked
    .append("rect")
    .attr("x", 0)
    .attr("y", index * 20)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colors[index]);

  legendBarChartStacked
    .append("text")
    .attr("x", 25)
    .attr("y", index * 20 + 15)
    .text(category);
});
