"use strict";

// Define chart size and margins / Definir el tamaño del gráfico y los márgenes
const baseWidthLineChartStacked = 750; // Total width of the chart / Ancho total del gráfico
const baseHeightLineChartStacked = 400; // Total height of the chart / Alto total del gráfico
const marginLineChartStacked = { top: 20, right: 30, bottom: 30, left: 40 }; // Margins / Márgenes

// Data for the stacked chart / Datos para el gráfico apilado
const dataStacked = [
  { date: new Date(2024, 0, 1), value1: 1000, value2: 500 },
  { date: new Date(2024, 1, 1), value1: 1100, value2: 1500 },
  { date: new Date(2024, 2, 1), value1: 2000, value2: 1200 },
  { date: new Date(2024, 3, 1), value1: 2100, value2: 800 },
  { date: new Date(2024, 4, 1), value1: 5100, value2: 2000 },
  { date: new Date(2024, 5, 1), value1: 5100, value2: 3000 },
];

// Create scales / Crear escalas
const xStacked = d3
  .scaleTime()
  .domain(d3.extent(dataStacked, (d) => d.date)) // Define the range of dates / Define el rango de fechas
  .range([
    marginLineChartStacked.left,
    baseWidthLineChartStacked - marginLineChartStacked.right,
  ]);

const yStacked = d3
  .scaleLinear()
  .domain([0, d3.max(dataStacked, (d) => d.value1 + d.value2)]) // Use the maximum value from both datasets / Usar el valor máximo de ambos conjuntos de datos
  .nice() // Adjust scale for better readability / Ajustar la escala para mejor legibilidad
  .range([
    baseHeightLineChartStacked - marginLineChartStacked.bottom,
    marginLineChartStacked.top,
  ]);

// Select the SVG for the stacked chart / Seleccionar el SVG para el gráfico apilado
const svgStacked = d3
  .select("#line-chart-stacked")
  .attr("width", baseWidthLineChartStacked)
  .attr("height", baseHeightLineChartStacked);

// Line generator for the first dataset / Generador de líneas para el primer conjunto de datos
const line1 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value1));

// Line generator for the second dataset / Generador de líneas para el segundo conjunto de datos
const line2 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value2));

// Draw the first line / Dibujar la primera línea
svgStacked
  .append("path")
  .datum(dataStacked)
  .attr("fill", "none") // No fill for the line / Sin relleno para la línea
  .attr("stroke", "#4d52ff") // Color for Revenue / Color para Revenue
  .attr("stroke-width", 4) // Line thickness / Grosor de la línea
  .attr("d", line1);

// Draw the second line / Dibujar la segunda línea
svgStacked
  .append("path")
  .datum(dataStacked)
  .attr("fill", "none") // No fill for the line / Sin relleno para la línea
  .attr("stroke", "#ff4d52") // Color for Expenses / Color para Expenses
  .attr("stroke-width", 4) // Line thickness / Grosor de la línea
  .attr("d", line2);

// X-axis for the stacked chart / Eje X para el gráfico apilado
svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightLineChartStacked - marginLineChartStacked.bottom})`
  )
  .call(
    d3
      .axisBottom(xStacked)
      .ticks(d3.timeMonth.every(1)) // One tick per month / Una marca por mes
      .tickFormat(d3.timeFormat("%B")) // Format as month name / Formatear como nombre del mes
      .tickSizeOuter(0) // No outer tick size / Sin tamaño de marcas externas
  );

// Y-axis for the stacked chart / Eje Y para el gráfico apilado
svgStacked
  .append("g")
  .attr("transform", `translate(${marginLineChartStacked.left},0)`)
  .call(d3.axisLeft(yStacked).ticks(5).tickFormat(d3.format(",.0f"))); // Format numbers / Formato de números

// Create legend / Crear la leyenda
const legend = svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(${
      baseWidthLineChartStacked - marginLineChartStacked.right - 100
    }, ${marginLineChartStacked.top})`
  ); // Adjust legend position / Ajustar la posición de la leyenda

// Color and text for Revenue / Color y texto de Revenue
legend
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#4d52ff"); // Line color for Revenue / Color de la línea de Revenue

legend
  .append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("Revenue")
  .style("font-size", "12px");

// Color and text for Expenses / Color y texto de Expenses
legend
  .append("rect")
  .attr("x", 0)
  .attr("y", 25)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#ff4d52"); // Line color for Expenses / Color de la línea de Expenses

legend
  .append("text")
  .attr("x", 30)
  .attr("y", 40)
  .text("Expenses")
  .style("font-size", "12px");
