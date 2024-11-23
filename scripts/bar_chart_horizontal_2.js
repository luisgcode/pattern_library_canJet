"use strict";

// Configuración del gráfico
const dataHorizontalBarChart = [
  { flightType: "Internacional", passengers: 200 },
  { flightType: "Doméstico", passengers: 150 },
  { flightType: "Charter", passengers: 275 },
];

// Elementos de Dropdown
const dropdown = document.getElementById("color-dropdown");
const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
const dropdownItems = dropdown.querySelectorAll(".dropdown-item");

// Crear y configurar el gráfico SVG
const svgHorizontalBar = d3
  .select("#bar-chart-horizontal")
  .attr("width", 750)
  .attr("height", 400);

const marginHorizontalBarChart = { top: 20, right: 20, bottom: 30, left: 100 };
const widthHorizontalBarChart =
  750 - marginHorizontalBarChart.left - marginHorizontalBarChart.right;
const heightHorizontalBarChart =
  400 - marginHorizontalBarChart.top - marginHorizontalBarChart.bottom;

// Escalas
const xHorizontalBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataHorizontalBarChart, (d) => d.passengers)])
  .range([marginHorizontalBarChart.left, widthHorizontalBarChart]);

const yHorizontalBar = d3
  .scaleBand()
  .domain(dataHorizontalBarChart.map((d) => d.flightType))
  .range([marginHorizontalBarChart.top, heightHorizontalBarChart])
  .padding(0.1);

// Crear los ejes
const createAxes = () => {
  svgHorizontalBar
    .append("g")
    .attr("transform", `translate(0,${heightHorizontalBarChart})`)
    .call(d3.axisBottom(xHorizontalBar).ticks(5))
    .attr("font-size", "14px")
    .attr("color", "#4f4f4f");

  svgHorizontalBar
    .append("g")
    .attr("transform", `translate(${marginHorizontalBarChart.left},0)`)
    .call(d3.axisLeft(yHorizontalBar).ticks(5))
    .attr("font-size", "14px")
    .attr("color", "#4f4f4f");
};

// Crear las barras con animación
const createBars = () => {
  svgHorizontalBar
    .selectAll(".bar")
    .data(dataHorizontalBarChart)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => yHorizontalBar(d.flightType))
    .attr("x", marginHorizontalBarChart.left)
    .attr("height", yHorizontalBar.bandwidth())
    .attr("width", 0) // Ancho inicial en 0 para animación
    .attr("fill", "#4d52ff") // Color inicial
    .transition() // Animación inicial
    .duration(800)
    .ease(d3.easeElasticOut) // Mejor animación de entrada
    .attr(
      "width",
      (d) => xHorizontalBar(d.passengers) - marginHorizontalBarChart.left
    );
};

// Manejar el clic en el dropdown
const handleDropdownToggle = () => {
  dropdown.classList.toggle("active"); // Alternar visibilidad del menú
};

// Cerrar el menú al hacer clic fuera
const handleClickOutsideDropdown = (event) => {
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("active");
  }
};

// Manejar la selección de un color
const handleColorChange = (event) => {
  const selectedColor = event.target.getAttribute("data-color"); // Obtener el color seleccionado

  // Cambiar el color de las barras con transición
  svgHorizontalBar
    .selectAll(".bar")
    .transition()
    .duration(500)
    .attr("fill", selectedColor)
    .ease(d3.easeLinear);

  // Cambiar el texto del botón al color seleccionado
  dropdownToggle.textContent = `Color: ${event.target.textContent}`;

  // Cerrar el menú después de la selección
  dropdown.classList.remove("active");
};

// Añadir los eventos
dropdownToggle.addEventListener("click", handleDropdownToggle);
document.addEventListener("click", handleClickOutsideDropdown);
dropdownItems.forEach((item) => {
  item.addEventListener("click", handleColorChange);
});

// Crear el gráfico al cargar
createAxes();
createBars();
