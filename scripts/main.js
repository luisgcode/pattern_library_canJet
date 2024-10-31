"use strict";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ LINE CHART
// Dimensiones base y márgenes
const baseWidthLineChart = 750;
const baseHeightLineChart = 400;
const marginLineChart = { top: 20, right: 30, bottom: 30, left: 40 };

// Datos de ejemplo
const data = [
  { date: new Date(2024, 0, 1), value: 1000 },
  { date: new Date(2024, 1, 1), value: 2500 },
  { date: new Date(2024, 2, 1), value: 2000 },
  { date: new Date(2024, 3, 1), value: 2100 },
  { date: new Date(2024, 4, 1), value: 5100 },
];

// Crear escalas
const x = d3
  .scaleTime()
  .domain(d3.extent(data, (d) => d.date))
  .range([marginLineChart.left, baseWidthLineChart - marginLineChart.right]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)]) // Usar el valor máximo de los datos para la escala
  .nice()
  .range([baseHeightLineChart - marginLineChart.bottom, marginLineChart.top]);

// Seleccionar el SVG
const svg = d3.select("#line-chart");

// Agregar la cuadrícula de fondo
const makeGrid = (scale, orientation) => {
  const grid = svg.append("g").attr("class", "grid");
  const ticks = scale.ticks(); // Obtiene los ticks de la escala

  if (orientation === "horizontal") {
    ticks.forEach((tick) => {
      grid
        .append("line")
        .attr("x1", marginLineChart.left) // Comienza desde el margen izquierdo
        .attr("x2", baseWidthLineChart - marginLineChart.right) // Termina en el margen derecho
        .attr("y1", y(tick)) // Usa la escala Y para la posición vertical
        .attr("y2", y(tick))
        .attr("stroke", "#e0e0e0") // Color de la línea de cuadrícula
        .attr("stroke-dasharray", "2,2"); // Línea discontinua
    });
  } else {
    ticks.forEach((tick) => {
      grid
        .append("line")
        .attr("x1", x(tick)) // Usa la escala X para la posición horizontal
        .attr("x2", x(tick))
        .attr("y1", marginLineChart.top) // Comienza desde el margen superior
        .attr("y2", baseHeightLineChart - marginLineChart.bottom) // Termina en el margen inferior
        .attr("stroke", "#e0e0e0") // Color de la línea de cuadrícula
        .attr("stroke-dasharray", "2,2"); // Línea discontinua
    });
  }
};

// Crear cuadrícula horizontal y vertical
makeGrid(y, "horizontal");
makeGrid(x, "vertical");

// Eje X
svg
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightLineChart - marginLineChart.bottom})`
  )
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
  .attr("transform", `translate(${marginLineChart.left},0)`)
  .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",.0f"))); // Formato de números

// Generador de la línea
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

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
  .attr("font-weight", "bold") // Añadir esta línea para hacer el texto en negrita
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
  .attr("r", 6)
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
  })
  .on("mouseout", function () {
    tooltipGroup.transition().duration(200).style("opacity", 0);
  });

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART
// Definir el tamaño del gráfico y los márgenes
const baseWidthBarChart = 750; // Ancho total del gráfico
const baseHeighBarChart = 400; // Alto total del gráfico
const marginBarChart = { top: 20, right: 30, bottom: 30, left: 40 }; // Márgenes

// Datos para el gráfico de barras
const dataBarChart = [
  { city: "London", value: 10000 },
  { city: "Toronto", value: 20000 },
  { city: "New York", value: 30000 },
  { city: "Tokyo", value: 40000 },
  { city: "Berlin", value: 30000 },
];

// Crear escalas
const xBar = d3
  .scaleBand()
  .domain(dataBarChart.map((d) => d.city))
  .range([marginBarChart.left, baseWidthBarChart - marginBarChart.right])
  .padding(0.1); // Espaciado entre las barras

const yBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataBarChart, (d) => d.value)]) // Valor máximo del eje Y
  .nice() // Mejora la escala de los valores
  .range([baseHeighBarChart - marginBarChart.bottom, marginBarChart.top]);

// Seleccionar el SVG para el gráfico de barras
const svgBar = d3
  .select("#bar-chart")
  .attr("width", baseWidthBarChart)
  .attr("height", baseHeighBarChart);

// Dibujar las barras
svgBar
  .selectAll(".bar")
  .data(dataBarChart)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d) => xBar(d.city))
  .attr("y", (d) => yBar(d.value))
  .attr("width", xBar.bandwidth())
  .attr(
    "height",
    (d) => baseHeighBarChart - marginBarChart.bottom - yBar(d.value)
  )
  .attr("fill", "#4d52ff"); // Color de las barras

// Eje X para el gráfico de barras
svgBar
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeighBarChart - marginBarChart.bottom})`
  )
  .call(d3.axisBottom(xBar));

// Eje Y para el gráfico de barras
svgBar
  .append("g")
  .attr("transform", `translate(${marginBarChart.left},0)`)
  .call(d3.axisLeft(yBar));
