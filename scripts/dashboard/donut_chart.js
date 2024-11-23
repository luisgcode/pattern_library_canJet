"use strict";
// DONUT CHART

// Datos del gráfico
const dataDonutChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsDonutChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthDonutChart = 700; // Aumentado tamaño del gráfico
const heightDonutChart = 290;
const radiusDonutChart = Math.min(widthDonutChart, heightDonutChart) / 2;

// Seleccionar el SVG y agregar un grupo
const svgDonutChart = d3
  .select("#donut-chart")
  .append("svg")
  .attr("width", widthDonutChart)
  .attr("height", heightDonutChart);

// Crear un grupo para el gráfico de dona
const chartGroupDonut = svgDonutChart
  .append("g")
  .attr(
    "transform",
    `translate(${widthDonutChart / 2}, ${heightDonutChart / 2})`
  ); // Centrar el gráfico

// Crear el generador de segmentos
const donutPie = d3.pie().value((d) => d.value); // Usar el valor para el donut chart

const arcDonut = d3
  .arc()
  .innerRadius(radiusDonutChart * 0.4) // Radio interno para crear el efecto de donut
  .outerRadius(radiusDonutChart);

// Dibujar segmentos con animación
const donutArcs = chartGroupDonut
  .selectAll("arc")
  .data(donutPie(dataDonutChart))
  .enter()
  .append("g")
  .attr("class", "arc");

donutArcs
  .append("path")
  .attr("fill", (d, i) => colorsDonutChart[i]) // Asignar color a cada sección
  .attr("d", arcDonut) // Dibujar arco
  .each(function (d) {
    this._current = { startAngle: 0, endAngle: 0 }; // Estado inicial
  })
  .transition() // Aplicar animación
  .duration(1000) // Duración de 1 segundo
  .attrTween("d", function (d) {
    const interpolate = d3.interpolate(this._current, d); // Interpolar ángulos
    this._current = interpolate(1); // Actualizar estado
    return function (t) {
      return arcDonut(interpolate(t)); // Animar arco
    };
  });

// Agregar porcentaje dentro de cada arco
donutArcs
  .append("text")
  .text(
    (d) =>
      `${(
        (d.data.value / d3.sum(dataDonutChart, (d) => d.value)) *
        100
      ).toFixed(1)}%`
  )
  .attr("transform", (d) => `translate(${arcDonut.centroid(d)})`) // Posicionar en el centro del arco
  .attr("text-anchor", "middle") // Alinear al centro
  .attr("class", "donut-chart-percentage");

// Leyenda
const legendDonutChart = svgDonutChart
  .append("g")
  .attr(
    "transform",
    `translate(${widthDonutChart / 2 + radiusDonutChart + 35}, 20)`
  );

dataDonutChart.forEach((d, i) => {
  const legendRow = legendDonutChart
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsDonutChart[i]);

  legendRow
    .append("text")
    .attr("x", 25)
    .attr("y", 14) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendDonutChart");
});
