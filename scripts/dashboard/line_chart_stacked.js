"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ LINE CHART STACKED
// Definir el tamaño del gráfico y los márgenes
const baseWidthLineChartStacked = 750; // Ancho total del gráfico
const baseHeightLineChartStacked = 400; // Alto total del gráfico
const marginLineChartStacked = { top: 20, right: 30, bottom: 30, left: 40 }; // Márgenes

// Datos para el gráfico apilado
const dataStacked = [
  { date: new Date(2024, 0, 1), value1: 1000, value2: 500 },
  { date: new Date(2024, 1, 1), value1: 1500, value2: 1500 },
  { date: new Date(2024, 2, 1), value1: 2000, value2: 1200 },
  { date: new Date(2024, 3, 1), value1: 2100, value2: 800 },
  { date: new Date(2024, 4, 1), value1: 5100, value2: 2000 },
  { date: new Date(2024, 5, 1), value1: 5100, value2: 3000 },
];

// Crear escalas
const xStacked = d3
  .scaleTime()
  .domain(d3.extent(dataStacked, (d) => d.date))
  .range([
    marginLineChartStacked.left,
    baseWidthLineChartStacked - marginLineChartStacked.right,
  ]);

const yStacked = d3
  .scaleLinear()
  .domain([0, d3.max(dataStacked, (d) => d.value1 + d.value2)]) // Usar el valor máximo de ambos conjuntos de datos
  .nice()
  .range([
    baseHeightLineChartStacked - marginLineChartStacked.bottom,
    marginLineChartStacked.top,
  ]);

// Seleccionar el SVG para el gráfico apilado
const svgStacked = d3
  .select("#line-chart-stacked")
  .attr("width", baseWidthLineChartStacked)
  .attr("height", baseHeightLineChartStacked);

// Generador de líneas
const line1 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value1));

const line2 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value2));

// Dibujar la primera línea
svgStacked
  .append("path")
  .datum(dataStacked)
  .attr("fill", "none")
  .attr("stroke", "#4d52ff") // Color para Revenue
  .attr("stroke-width", 4)
  .attr("d", line1);

// Dibujar la segunda línea
svgStacked
  .append("path")
  .datum(dataStacked)
  .attr("fill", "none")
  .attr("stroke", "#ff4d52") // Color para Expenses
  .attr("stroke-width", 4)
  .attr("d", line2);

// Eje X para el gráfico apilado
svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightLineChartStacked - marginLineChartStacked.bottom})`
  )
  .call(
    d3
      .axisBottom(xStacked)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat("%B"))
      .tickSizeOuter(0)
  );

// Eje Y para el gráfico apilado
svgStacked
  .append("g")
  .attr("transform", `translate(${marginLineChartStacked.left},0)`)
  .call(d3.axisLeft(yStacked).ticks(5).tickFormat(d3.format(",.0f"))); // Formato de números

// Crear la leyenda
const legend = svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(${
      baseWidthLineChartStacked - marginLineChartStacked.right - 100
    }, ${marginLineChartStacked.top})`
  ); // Ajusta la posición de la leyenda

// Color y texto de Revenue
legend
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#4d52ff"); // Color de la línea de Revenue

legend
  .append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("Revenue")
  .style("font-size", "12px");

// Color y texto de Expenses
legend
  .append("rect")
  .attr("x", 0)
  .attr("y", 25)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#ff4d52"); // Color de la línea de Expenses

legend
  .append("text")
  .attr("x", 30)
  .attr("y", 40)
  .text("Expenses")
  .style("font-size", "12px");
