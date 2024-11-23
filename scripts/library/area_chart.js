"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ AREA CHART
// Definir el tamaño del gráfico y los márgenes
const baseWidthAreaChart = 750; // Ancho total del gráfico
const baseHeightAreaChart = 400; // Alto total del gráfico
const marginAreaChart = { top: 20, right: 30, bottom: 50, left: 50 }; // Márgenes

// Datos para el gráfico de área (ejemplo de valores)
const dataAreaChart = [
  { month: "January", value: 1200 },
  { month: "February", value: 1800 },
  { month: "March", value: 2500 },
  { month: "April", value: 3000 },
  { month: "May", value: 4500 },
  { month: "June", value: 4000 },
  { month: "July", value: 3500 },
];

// Crear escalas para el eje X y Y
const xArea = d3
  .scaleBand()
  .domain(dataAreaChart.map((d) => d.month))
  .range([marginAreaChart.left, baseWidthAreaChart - marginAreaChart.right])
  .padding(0.1); // Espaciado entre las barras

const yArea = d3
  .scaleLinear()
  .domain([0, d3.max(dataAreaChart, (d) => d.value)]) // Cambiado el valor mínimo a 0
  .range([baseHeightAreaChart - marginAreaChart.bottom, marginAreaChart.top]);

// Seleccionar el SVG para el gráfico de área
const svgArea = d3
  .select("#area-chart")
  .attr("width", baseWidthAreaChart)
  .attr("height", baseHeightAreaChart);

// Dibujar la cuadrícula en el fondo
svgArea
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(${marginAreaChart.left}, 0)`)
  .call(
    d3
      .axisLeft(yArea)
      .ticks(5)
      .tickSize(
        -baseWidthAreaChart + marginAreaChart.right + marginAreaChart.left
      )
      .tickFormat("")
  );

// Crear el área
const area = d3
  .area()
  .x((d) => xArea(d.month) + xArea.bandwidth() / 2) // Centrar el área en las barras
  .y0(yArea(0)) // Base del área en el eje Y
  .y1((d) => yArea(d.value)); // Altura del área según el valor

// Dibujar el área
svgArea
  .append("path")
  .datum(dataAreaChart) // Vínculo de datos
  .attr("class", "area")
  .attr("fill", "#4d52ff") // Color del área
  .attr("d", area); // Definición del área

// Eje X para el gráfico de área
svgArea
  .append("g")
  .attr(
    "transform",
    `translate(0, ${baseHeightAreaChart - marginAreaChart.bottom})`
  )
  .call(d3.axisBottom(xArea));

// Eje Y para el gráfico de área
svgArea
  .append("g")
  .attr("transform", `translate(${marginAreaChart.left}, 0)`)
  .call(d3.axisLeft(yArea));
