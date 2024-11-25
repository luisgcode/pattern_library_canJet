"use strict";
// Configuración de los datos del gráfico / Chart data setup
const dataHorizontalBarChart = [
  { flightType: "International", passengers: 200 },
  { flightType: "Domestic", passengers: 150 },
  { flightType: "Charter", passengers: 275 },
];

// Elementos del menú desplegable / Dropdown elements
const dropdown = document.getElementById("color-dropdown");
const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
const dropdownItems = dropdown.querySelectorAll(".dropdown-item");

// Crear y configurar el gráfico SVG / Create and configure the SVG chart
const svgHorizontalBar = d3
  .select("#bar-chart-horizontal")
  .attr("width", 750) // Ancho del gráfico / Chart width
  .attr("height", 400); // Altura del gráfico / Chart height

// Configuración de márgenes y dimensiones internas del gráfico
// Chart margins and inner dimensions
const marginHorizontalBarChart = { top: 20, right: 20, bottom: 30, left: 100 };
const widthHorizontalBarChart =
  750 - marginHorizontalBarChart.left - marginHorizontalBarChart.right;
const heightHorizontalBarChart =
  400 - marginHorizontalBarChart.top - marginHorizontalBarChart.bottom;

// Escalas para los ejes X e Y / Scales for X and Y axes
const xHorizontalBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataHorizontalBarChart, (d) => d.passengers)]) // Rango de pasajeros / Passenger range
  .range([marginHorizontalBarChart.left, widthHorizontalBarChart]);

const yHorizontalBar = d3
  .scaleBand()
  .domain(dataHorizontalBarChart.map((d) => d.flightType)) // Tipos de vuelo / Flight types
  .range([marginHorizontalBarChart.top, heightHorizontalBarChart])
  .padding(0.1); // Espaciado entre barras / Spacing between bars

// Crear los ejes del gráfico / Create chart axes
const createAxes = () => {
  svgHorizontalBar
    .append("g")
    .attr("transform", `translate(0,${heightHorizontalBarChart})`)
    .call(d3.axisBottom(xHorizontalBar).ticks(5)) // Eje X / X axis
    .attr("font-size", "14px")
    .attr("color", "#4f4f4f");

  svgHorizontalBar
    .append("g")
    .attr("transform", `translate(${marginHorizontalBarChart.left},0)`)
    .call(d3.axisLeft(yHorizontalBar).ticks(5)) // Eje Y / Y axis
    .attr("font-size", "14px")
    .attr("color", "#4f4f4f");
};

// Crear las barras con animación / Create bars with animation
const createBars = () => {
  svgHorizontalBar
    .selectAll(".bar")
    .data(dataHorizontalBarChart) // Vincular datos / Bind data
    .enter()
    .append("rect") // Crear rectángulos para las barras / Create rectangles for bars
    .attr("class", "bar")
    .attr("y", (d) => yHorizontalBar(d.flightType)) // Posición Y / Y position
    .attr("x", marginHorizontalBarChart.left) // Posición inicial X / Initial X position
    .attr("height", yHorizontalBar.bandwidth()) // Altura de las barras / Bar height
    .attr("width", 0) // Ancho inicial (para animación) / Initial width (for animation)
    .attr("fill", "#4d52ff") // Color inicial de las barras / Initial bar color
    .transition() // Animación inicial / Initial animation
    .duration(800)
    .ease(d3.easeElasticOut) // Animación elástica / Elastic animation
    .attr(
      "width",
      (d) => xHorizontalBar(d.passengers) - marginHorizontalBarChart.left
    );
};

// Manejar el clic en el botón del menú desplegable
// Handle dropdown button click
const handleDropdownToggle = () => {
  dropdown.classList.toggle("active"); // Alternar visibilidad del menú / Toggle menu visibility
};

// Cerrar el menú si se hace clic fuera de él
// Close menu when clicking outside
const handleClickOutsideDropdown = (event) => {
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("active");
  }
};

// Manejar la selección de un color / Handle color selection
const handleColorChange = (event) => {
  const selectedColor = event.target.getAttribute("data-color"); // Obtener el color seleccionado / Get selected color

  // Cambiar el color de las barras con animación / Change bar colors with animation
  svgHorizontalBar
    .selectAll(".bar")
    .transition()
    .duration(500)
    .attr("fill", selectedColor)
    .ease(d3.easeLinear);

  // Actualizar el texto del botón al color seleccionado / Update button text to selected color
  dropdownToggle.textContent = `Color: ${event.target.textContent}`;

  // Cerrar el menú después de la selección / Close the menu after selection
  dropdown.classList.remove("active");
};

// Añadir eventos a los elementos del menú / Add events to dropdown elements
dropdownToggle.addEventListener("click", handleDropdownToggle);
document.addEventListener("click", handleClickOutsideDropdown);
dropdownItems.forEach((item) => {
  item.addEventListener("click", handleColorChange);
});

// Crear el gráfico al cargar / Create chart on page load
createAxes();
createBars();
