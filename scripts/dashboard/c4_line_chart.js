"use strict";

// Base dimensions and margins / Dimensiones base y márgenes
const baseWidthLineChart = 750; // Total width of the chart / Ancho total del gráfico
const baseHeightLineChart = 400; // Total height of the chart / Alto total del gráfico
const marginLineChart = { top: 20, right: 30, bottom: 30, left: 40 }; // Margins / Márgenes

// Example datasets / Conjuntos de datos de ejemplo
const datasets = {
  passengers: [
    { date: new Date(2024, 0, 1), value: 1000 },
    { date: new Date(2024, 1, 1), value: 2500 },
    { date: new Date(2024, 2, 1), value: 1000 },
    { date: new Date(2024, 3, 1), value: 2100 },
    { date: new Date(2024, 4, 1), value: 5100 },
  ],
  revenue: [
    { date: new Date(2024, 0, 1), value: 5000 },
    { date: new Date(2024, 1, 1), value: 12000 },
    { date: new Date(2024, 2, 1), value: 15000 },
    { date: new Date(2024, 3, 1), value: 17000 },
    { date: new Date(2024, 4, 1), value: 12000 },
  ],
};

// Initialize chart with default data (passengers) / Inicializar gráfico con datos predeterminados (pasajeros)
let currentData = datasets.passengers;

// Scales / Escalas
const x = d3
  .scaleTime()
  .range([marginLineChart.left, baseWidthLineChart - marginLineChart.right]);
const y = d3
  .scaleLinear()
  .range([baseHeightLineChart - marginLineChart.bottom, marginLineChart.top]);

// Select SVG element / Seleccionar el elemento SVG
const svg = d3.select("#line-chart");

// Line generator function / Función generadora de líneas
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

// Function to update the chart with new data / Función para actualizar el gráfico con nuevos datos
function updateChart(data) {
  // Update scales / Actualizar escalas
  x.domain(d3.extent(data, (d) => d.date));
  y.domain([0, d3.max(data, (d) => d.value)]).nice();

  // Clear previous chart elements / Limpiar elementos previos del gráfico
  svg.selectAll("*").remove();

  // Draw X axis / Dibujar eje X
  svg
    .append("g")
    .attr(
      "transform",
      `translate(0,${baseHeightLineChart - marginLineChart.bottom})`
    )
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%B"))
    );

  // Draw Y axis / Dibujar eje Y
  svg
    .append("g")
    .attr("transform", `translate(${marginLineChart.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",.0f")));

  // Draw the line with animation / Dibujar la línea con animación
  const path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#ff4d52") // Line color / Color de la línea
    .attr("stroke-width", 3)
    .attr("d", line);

  // Animate the drawing of the line / Animar el dibujo de la línea
  const totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  // Draw points with animation / Dibujar puntos con animación
  const points = svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.date))
    .attr("cy", (d) => y(d.value))
    .attr("r", 0) // Start with radius 0 / Comenzar con radio 0
    .attr("fill", "#ff4d52")
    .on("mouseover", function (event, d) {
      const [xPos, yPos] = [x(d.date), y(d.value)]; // Point coordinates in SVG / Coordenadas del punto en el SVG
      const tooltip = d3.select("#tooltip");
      tooltip
        .style("opacity", 1)
        .style("left", `${xPos + marginLineChart.left}px`) // Adjust based on left margin / Ajusta según el margen izquierdo
        .style("top", `${yPos + marginLineChart.top}px`) // Adjust based on top margin / Ajusta según el margen superior
        .html(`Value: ${d.value.toLocaleString()}`);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    });

  // Animate points to appear / Animar la aparición de los puntos
  points
    .transition()
    .delay((d, i) => i * 200) // Delay each point's appearance / Retrasar la aparición de cada punto
    .duration(500)
    .attr("r", 6);
}

// Event listener for dropdown menu to switch datasets / Listener del menú desplegable para cambiar conjuntos de datos
document.getElementById("data-selector").addEventListener("change", (event) => {
  const selectedDataset = event.target.value;
  currentData = datasets[selectedDataset];
  updateChart(currentData);
});

// Initial render of the chart / Renderizado inicial del gráfico
updateChart(currentData);
