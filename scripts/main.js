"use strict";

//////////////////////////////////////////////////////////// ^ LINE CHART
// Dimensiones base y márgenes
const baseWidth = 750;
const baseHeight = 400;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

// Datos de ejemplo
const data = [
  { date: new Date(2024, 0, 1), value: 1000 },
  { date: new Date(2024, 1, 1), value: 2500 },
  { date: new Date(2024, 2, 1), value: 2000 },
  { date: new Date(2024, 3, 1), value: 2100 },
  { date: new Date(2024, 4, 1), value: 6100 },
];

// Crear escalas
const x = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date))
  .range([margin.left, baseWidth - margin.right]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)]) // Usar el valor máximo de los datos para la escala
  .nice()
  .range([baseHeight - margin.bottom, margin.top]);

// Generador de la línea
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

// Seleccionar el SVG
const svg = d3.select("#line-chart");

// Eje X
svg
  .append("g")
  .attr("transform", `translate(0,${baseHeight - margin.bottom})`)
  .call(
    d3
      .axisBottom(x)
      .ticks(d3.timeMonth.every(1)) // Muestra un tick por mes
      .tickFormat(d3.timeFormat("%B")) // Formato para mostrar el nombre completo del mes
      .tickSizeOuter(0)
  );

// Eje Y
svg
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",.0f"))); // Formato de números

// Dibujar la línea
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "#4d52ff")
  .attr("stroke-width", 4) // Aumenta el valor a 4 o más
  .attr("d", line);

// Crear el tooltip
const tooltipGroup = svg
  .append("g")
  .attr("class", "tooltip")
  .style("opacity", 0); // Comienza invisible

// Cuadrado de fondo del tooltip
tooltipGroup
  .append("rect")
  .attr("fill", "#5bc0de") // Color del fondo
  .attr("rx", 5) // Esquinas redondeadas
  .attr("ry", 5) // Esquinas redondeadas
  .attr("width", 100) // Ancho del rectángulo
  .attr("height", 40); // Alto del rectángulo

// Texto del tooltip
tooltipGroup
  .append("text")
  .attr("text-anchor", "middle") // Alinear el texto en el medio
  .attr("font-size", "12px")
  .attr("fill", "#fff") // Color del texto
  .attr("dy", "2em") // Desplazamiento vertical del texto
  .attr("x", 50) // Centrar el texto horizontalmente dentro del rectángulo
  .text(""); // Inicialmente vacío

// Agregar puntos a la línea para el tooltip
svg
  .selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", (d) => x(d.date))
  .attr("cy", (d) => y(d.value))
  .attr("r", 4)
  .attr("fill", "#4d52ff")

  .on("mouseover", function (event, d) {
    tooltipGroup.transition().duration(200).style("opacity", 1);

    // Ajusta la posición vertical del tooltip
    tooltipGroup.attr(
      "transform",
      `translate(${x(d.date)}, ${y(d.value) - 30})` // Elevar el tooltip
    );

    // Actualiza el texto del tooltip para mostrar solo el valor Y
    tooltipGroup.select("text").text(`${d.value.toLocaleString()}`); // Muestra el valor Y formateado
  });
