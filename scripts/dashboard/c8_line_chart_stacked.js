"use strict";

// Define chart size and margins
// Definir el tamaño del gráfico y los márgenes
const baseWidthLineChartStacked = 750;
const baseHeightLineChartStacked = 400;
const marginLineChartStacked = { top: 20, right: 30, bottom: 30, left: 40 };

// Data for the stacked chart
// Datos para el gráfico apilado
const dataStacked = [
  { date: new Date(2024, 0, 1), value1: 1000, value2: 500 },
  { date: new Date(2024, 1, 1), value1: 1100, value2: 1500 },
  { date: new Date(2024, 2, 1), value1: 2000, value2: 1200 },
  { date: new Date(2024, 3, 1), value1: 2100, value2: 800 },
  { date: new Date(2024, 4, 1), value1: 5100, value2: 1000 },
  { date: new Date(2024, 5, 1), value1: 5100, value2: 3000 },
];

// Create scales
// Crear las escalas
const xStacked = d3
  .scaleTime()
  .domain(d3.extent(dataStacked, (d) => d.date)) // Set the domain for x-axis based on the date range
  .range([
    marginLineChartStacked.left,
    baseWidthLineChartStacked - marginLineChartStacked.right,
  ]); // Define the range of the x-axis

const yStacked = d3
  .scaleLinear()
  .domain([0, d3.max(dataStacked, (d) => d.value1 + d.value2)]) // Set the domain for y-axis based on the sum of values
  .nice() // Automatically adjust the axis to nice round values
  .range([
    baseHeightLineChartStacked - marginLineChartStacked.bottom,
    marginLineChartStacked.top,
  ]); // Define the range of the y-axis

// Create tooltip div if it doesn't exist
// Crear el div del tooltip si no existe
const tooltip = d3
  .select("body")
  .selectAll(".chart-tooltip")
  .data([0])
  .enter()
  .append("div")
  .attr("class", "chart-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden") // Initially, set the tooltip as hidden
  .style("background-color", "rgba(255, 255, 255, 0.95)")
  .style("border", "1px solid #ddd")
  .style("padding", "8px 12px")
  .style("border-radius", "4px")
  .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
  .style("font-size", "12px")
  .style("pointer-events", "none")
  .style("z-index", "1000");

// Select the SVG for the stacked chart
// Seleccionar el SVG para el gráfico apilado
const svgStacked = d3
  .select("#line-chart-stacked")
  .attr("width", baseWidthLineChartStacked)
  .attr("height", baseHeightLineChartStacked);

// Line generators for both value1 and value2
// Generadores de líneas para value1 y value2
const line1 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value1));

const line2 = d3
  .line()
  .x((d) => xStacked(d.date))
  .y((d) => yStacked(d.value2));

// Draw lines with points
// Dibujar líneas con puntos
function drawLineWithPoints(data, valueKey, color, className) {
  const group = svgStacked.append("g").attr("class", className); // Create a group for each line

  // Draw the line
  // Dibujar la línea
  group
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 3)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xStacked(d.date))
        .y((d) => yStacked(d[valueKey]))
    );

  // Draw points on the line
  // Dibujar los puntos sobre la línea
  const points = group
    .selectAll(".point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => xStacked(d.date))
    .attr("cy", (d) => yStacked(d[valueKey]))
    .attr("r", 2)
    .attr("fill", "white")
    .attr("stroke", color)
    .attr("stroke-width", 3)
    .style("cursor", "pointer");

  // Add hover effects and tooltip
  // Agregar efectos al pasar el ratón y el tooltip
  points
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(200).attr("r", 8); // Increase point size on hover

      tooltip
        .style("visibility", "visible")
        .html(
          `${valueKey === "value1" ? "Revenue" : "Expenses"}: $${d3.format(
            ",.0f"
          )(d[valueKey])}`
        )
        .style("color", color); // Show the value in the tooltip

      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 20}px`); // Position the tooltip
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 20}px`); // Update tooltip position while moving the mouse
    })
    .on("mouseout", function () {
      d3.select(this).transition().duration(200).attr("r", 6); // Restore point size when the mouse leaves
      tooltip.style("visibility", "hidden"); // Hide the tooltip
    });

  return group;
}

// Draw both lines with points
// Dibujar ambas líneas con puntos
const line1Group = drawLineWithPoints(
  dataStacked,
  "value1",
  "#4d52ff",
  "revenue-line"
);
const line2Group = drawLineWithPoints(
  dataStacked,
  "value2",
  "#ff4d52",
  "expenses-line"
);

// Add axes
// Agregar los ejes
svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightLineChartStacked - marginLineChartStacked.bottom})`
  )
  .call(
    d3
      .axisBottom(xStacked)
      .ticks(d3.timeMonth.every(1)) // Set ticks every month
      .tickFormat(d3.timeFormat("%B"))
      .tickSizeOuter(0)
  );

svgStacked
  .append("g")
  .attr("transform", `translate(${marginLineChartStacked.left},0)`)
  .call(d3.axisLeft(yStacked).ticks(5).tickFormat(d3.format(",.0f")));

// Add legend
// Agregar la leyenda
const legend = svgStacked
  .append("g")
  .attr(
    "transform",
    `translate(${
      baseWidthLineChartStacked - marginLineChartStacked.right - 150
    }, ${marginLineChartStacked.top})`
  );

function addLegendItem(config) {
  const item = legend
    .append("g")
    .attr("class", `legend-item ${config.class}`)
    .attr("transform", `translate(0, ${config.y})`)
    .style("cursor", "pointer");

  item
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", config.color);

  item
    .append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text(config.text)
    .style("font-size", "12px")
    .style("user-select", "none");

  return item;
}

// Add legend items with interactivity
// Agregar los elementos de la leyenda con interactividad
const revenueLegend = addLegendItem({
  y: 0,
  color: "#4d52ff",
  text: "Revenue",
  class: "revenue-legend",
});

const expensesLegend = addLegendItem({
  y: 30,
  color: "#ff4d52",
  text: "Expenses",
  class: "expenses-legend",
});

// Add legend interactivity
// Agregar interactividad a la leyenda
revenueLegend.on("click", function () {
  const currentOpacity = line1Group.style("opacity");
  const newOpacity = currentOpacity === "1" ? "0" : "1"; // Toggle visibility
  line1Group.style("opacity", newOpacity);
});

expensesLegend.on("click", function () {
  const currentOpacity = line2Group.style("opacity");
  const newOpacity = currentOpacity === "1" ? "0" : "1"; // Toggle visibility
  line2Group.style("opacity", newOpacity);
});
