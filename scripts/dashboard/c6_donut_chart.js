"use strict";
// Chart Data / Datos del gráfico
const dataDonutChart = [
  { category: "Economy", value: 30 }, // Economy / Economía
  { category: "Business", value: 50 }, // Business / Negocios
  { category: "First Class", value: 20 }, // First Class / Primera Clase
];

// Colors for the sections / Colores para las secciones
const colorsDonutChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Light blue, red, dark blue / Azul claro, rojo, azul oscuro

// Dimensions and radius of the chart / Dimensiones y radio del gráfico
const widthDonutChart = 700; // Chart width / Ancho del gráfico
const heightDonutChart = 290; // Chart height / Altura del gráfico
const radiusDonutChart = Math.min(widthDonutChart, heightDonutChart) / 2; // Calculate radius / Calcular radio

// Select the SVG container and append an SVG element
// Seleccionar el contenedor SVG y añadir un elemento SVG
const svgDonutChart = d3
  .select("#donut-chart")
  .append("svg")
  .attr("width", widthDonutChart) // Set width / Asignar ancho
  .attr("height", heightDonutChart); // Set height / Asignar altura

// Append a group element to center the donut chart
// Agregar un elemento de grupo para centrar el gráfico de dona
const chartGroupDonut = svgDonutChart
  .append("g")
  .attr(
    "transform",
    `translate(${widthDonutChart / 2}, ${heightDonutChart / 2})`
  );

// Pie generator to calculate angles
// Generador de sectores para calcular los ángulos
const donutPie = d3.pie().value((d) => d.value);

// Arc generator to define the inner and outer radius
// Generador de arcos para definir el radio interno y externo
const arcDonut = d3
  .arc()
  .innerRadius(radiusDonutChart * 0.4) // Inner radius for donut effect / Radio interno para efecto de dona
  .outerRadius(radiusDonutChart); // Outer radius / Radio externo

// Draw chart segments with animation
// Dibujar los segmentos del gráfico con animación
const donutArcs = chartGroupDonut
  .selectAll("arc")
  .data(donutPie(dataDonutChart)) // Bind data / Vincular datos
  .enter()
  .append("g")
  .attr("class", "arc");

// Append paths for each segment with colors and animation
// Agregar caminos para cada segmento con colores y animación
donutArcs
  .append("path")
  .attr("fill", (d, i) => colorsDonutChart[i]) // Assign colors / Asignar colores
  .attr("d", arcDonut) // Draw arc / Dibujar arco
  .each(function (d) {
    this._current = { startAngle: 0, endAngle: 0 }; // Initial state for animation / Estado inicial para la animación
  })
  .transition() // Apply animation / Aplicar animación
  .duration(1000) // Duration: 1 second / Duración: 1 segundo
  .attrTween("d", function (d) {
    const interpolate = d3.interpolate(this._current, d); // Interpolate angles / Interpolar ángulos
    this._current = interpolate(1); // Update current state / Actualizar estado actual
    return function (t) {
      return arcDonut(interpolate(t)); // Animate the arc / Animar el arco
    };
  });

// Add percentage labels inside each arc
// Agregar etiquetas de porcentaje dentro de cada arco
donutArcs
  .append("text")
  .text(
    (d) =>
      `${(
        (d.data.value / d3.sum(dataDonutChart, (d) => d.value)) *
        100
      ).toFixed(1)}%` // Calculate percentage / Calcular porcentaje
  )
  .attr("transform", (d) => `translate(${arcDonut.centroid(d)})`) // Position text at the center of the arc / Posicionar texto en el centro del arco
  .attr("text-anchor", "middle") // Center-align text / Alinear texto al centro
  .attr("class", "donut-chart-percentage");

// Add legend to the chart
// Agregar una leyenda al gráfico
const legendDonutChart = svgDonutChart.append("g").attr(
  "transform",
  `translate(${widthDonutChart / 2 + radiusDonutChart + 35}, 20)` // Position legend / Posicionar la leyenda
);

// Add legend rows for each data category
// Agregar filas de leyenda para cada categoría de datos
dataDonutChart.forEach((d, i) => {
  const legendRow = legendDonutChart
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Space between legends / Espacio entre leyendas

  legendRow
    .append("rect")
    .attr("width", 18) // Legend box width / Ancho del cuadro de leyenda
    .attr("height", 18) // Legend box height / Altura del cuadro de leyenda
    .attr("fill", colorsDonutChart[i]); // Color block for legend / Color del cuadro de la leyenda

  legendRow
    .append("text")
    .attr("x", 25) // Position text next to the box / Posicionar texto al lado del cuadro
    .attr("y", 14) // Align vertically with the box / Alinear verticalmente con el cuadro
    .text(d.category) // Add category name / Añadir nombre de la categoría
    .attr("class", "legendDonutChart");
});
