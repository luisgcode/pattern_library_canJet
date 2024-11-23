"use strict";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PIE CHART

// Datos del gráfico
const dataPieChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsPieChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthPieChart = 700; // Incrementar para espacio adicional
const heightPieChart = 400;
const radiusPieChart = Math.min(widthPieChart, heightPieChart) / 2;

// Seleccionar el SVG y agregar un grupo principal
const svgPieChart = d3
  .select("#pie-chart")
  .append("svg")
  .attr("width", widthPieChart)
  .attr("height", heightPieChart);

// Crear un grupo para el gráfico de pastel
const chartGroup = svgPieChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusPieChart + 170}, ${heightPieChart / 2})`
  ); // Centrar el gráfico

// Crear el generador de segmentos
const pie = d3.pie().value((d) => d.value);

const arc = d3
  .arc()
  .innerRadius(0) // Para gráfico de pastel, el radio interno es 0
  .outerRadius(radiusPieChart - 20); // Ajustar el radio para que haya espacio

// Dibujar segmentos con animación
const arcs = chartGroup
  .selectAll("arc")
  .data(pie(dataPieChart))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs
  .append("path")
  .attr("fill", (d, i) => colorsPieChart[i]) // Asignar color a cada sección
  .attr("d", arc) // Dibujar arco
  .each(function (d) {
    this._current = { startAngle: 0, endAngle: 0 }; // Estado inicial
  })
  .transition() // Aplicar animación
  .duration(1000) // Duración de 1 segundo
  .attrTween("d", function (d) {
    const interpolate = d3.interpolate(this._current, d); // Interpolar ángulos
    this._current = interpolate(1); // Actualizar estado
    return function (t) {
      return arc(interpolate(t)); // Animar arco
    };
  });

// Agregar etiquetas de porcentaje en cada segmento
arcs
  .append("text")
  .text(
    (d) =>
      `${((d.data.value / d3.sum(dataPieChart, (d) => d.value)) * 100).toFixed(
        1
      )}%`
  )
  .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Posicionar en el centro del arco
  .attr("text-anchor", "middle") // Centrar el texto horizontalmente
  .attr("class", "pie-chart-percentage");

// Crear un grupo separado para la leyenda
const legendGroup = svgPieChart
  .append("g")
  .attr("transform", `translate(${radiusPieChart * 2 + 180}, 20)`); // Posición de la leyenda a la derecha

// Crear las leyendas
dataPieChart.forEach((d, i) => {
  const legendRow = legendGroup
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsPieChart[i]);

  legendRow
    .append("text")
    .attr("x", 25)
    .attr("y", 14) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendPieChart");
});
