"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ SCATTER PLOT
// Definir datos para el gráfico de dispersión
const dataScatterPlot = [
  { age: 10, points: 1, satisfaction: 3 },
  { age: 20, points: 2, satisfaction: 2 },
  { age: 30, points: 4, satisfaction: 5 },
  { age: 40, points: 3, satisfaction: 4 },
  { age: 50, points: 5, satisfaction: 1 },
  { age: 15, points: 4, satisfaction: 5 },
  { age: 25, points: 3, satisfaction: 2 },
  { age: 35, points: 2, satisfaction: 4 },
  { age: 45, points: 1, satisfaction: 3 },
  { age: 55, points: 5, satisfaction: 5 },
];

// Definir márgenes y dimensiones del gráfico
const marginScatterPlot = { top: 20, right: 30, bottom: 50, left: 80 }; // Aumentar margen izquierdo para la leyenda
const widthScatterPlot = 750; // Ancho del gráfico
const heightScatterPlot = 400; // Altura del gráfico

// Crear escalas
const xScale = d3
  .scaleLinear()
  .domain([10, 60]) // Cambiar el rango de edad para que comience en 10
  .range([
    0,
    widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right,
  ]); // Ajustar rango según márgenes

const yScale = d3
  .scaleLinear()
  .domain([0, 5]) // Rango de puntos
  .range([
    heightScatterPlot - marginScatterPlot.top - marginScatterPlot.bottom,
    0,
  ]); // Ajustar rango según márgenes

// Seleccionar el SVG y agregar un grupo para el gráfico
const svgScatterPlot = d3
  .select("#scatter-plot")
  .append("g")
  .attr(
    "transform",
    `translate(${marginScatterPlot.left}, ${marginScatterPlot.top})`
  );

// Agregar cuadrícula de fondo
const gridlinesX = d3.axisBottom(xScale).ticks(5);

const gridlinesY = d3.axisLeft(yScale).ticks(5);

// Crear líneas de cuadrícula X
svgScatterPlot
  .append("g")
  .attr("class", "grid")
  .attr(
    "transform",
    `translate(0, ${heightScatterPlot - marginScatterPlot.bottom})`
  )
  .call(
    gridlinesX
      .tickSize(
        -heightScatterPlot + marginScatterPlot.top + marginScatterPlot.bottom
      )
      .tickFormat("")
  )
  .selectAll(".tick line") // Seleccionar las líneas de la cuadrícula
  .attr("stroke", "#a0a0a0"); // Establecer el color de las líneas de cuadrícula X

// Crear líneas de cuadrícula Y
svgScatterPlot
  .append("g")
  .attr("class", "grid")
  .call(
    gridlinesY
      .tickSize(
        -widthScatterPlot + marginScatterPlot.left + marginScatterPlot.right
      )
      .tickFormat("")
  )
  .selectAll(".tick line") // Seleccionar las líneas de la cuadrícula
  .attr("stroke", "#a0a0a0"); // Establecer el color de las líneas de cuadrícula Y

// Dibujar círculos para el gráfico de dispersión
svgScatterPlot
  .selectAll("circle")
  .data(dataScatterPlot) // Usar dataScatterPlot
  .enter()
  .append("circle")
  .attr("class", "circle")
  .attr("cx", (d) => xScale(d.age)) // Eje X (edad)
  .attr("cy", (d) => yScale(d.points)) // Eje Y (puntos)
  .attr("r", 5); // Radio de los círculos

// Crear eje X
const xAxis = d3
  .axisBottom(xScale)
  .ticks(5) // Número de ticks
  .tickFormat(d3.format("d")); // Formato de los ticks

svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .attr(
    "transform",
    `translate(0, ${heightScatterPlot - marginScatterPlot.bottom})`
  ) // Ajustar posición del eje X
  .call(xAxis)
  .append("text")
  .attr(
    "x",
    (widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right) / 2
  ) // Ajustar posición centrada debajo del gráfico
  .attr("y", 35)
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Age");

// Crear eje Y
const yAxis = d3.axisLeft(yScale).ticks(5); // Número de ticks

svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -50) // Ajustar posición vertical para la leyenda de puntos
  .attr("x", -heightScatterPlot / 2 + 20) // Ajustar posición horizontal
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Points");

// Leyenda
const legendScatter = svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .attr("transform", `translate(${widthScatterPlot - 310}, 30)`); // Mover la leyenda más a la izquierda

legendScatter
  .append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#ff4d52");

legendScatter
  .append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("Customer Satisfaction")
  .attr("alignment-baseline", "middle"); // Alinear verticalmente el texto de la leyenda

// Leyenda de "Points" a la izquierda
svgScatterPlot
  .append("text")
  .attr("x", -marginScatterPlot.left / 1.5) // Ajustar posición horizontal
  .attr("y", heightScatterPlot / 2) // Ajustar posición vertical
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Points");

// Leyenda de "Age" debajo del eje X
svgScatterPlot
  .append("text")
  .attr(
    "x",
    (widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right) / 2
  ) // Centrar debajo del gráfico
  .attr("y", heightScatterPlot - marginScatterPlot.bottom + 25) // Posición debajo del eje X
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Age");
