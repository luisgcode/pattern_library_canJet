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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART STACKED
// Definir el tamaño del gráfico y los márgenes
const baseWidthStackedBarChart = 750; // Ancho total del gráfico
const baseHeightStackedBarChart = 400; // Alto total del gráfico
const marginStackedBarChart = { top: 20, right: 30, bottom: 30, left: 40 }; // Márgenes

// Datos para el gráfico de barras apiladas
const dataStackedBarChart = [
  { month: "January", firstClass: 1, business: 2, economy: 3 },
  { month: "February", firstClass: 1.5, business: 2.5, economy: 12.5 },
  { month: "March", firstClass: 2, business: 3, economy: 4 },
  { month: "April", firstClass: 2.5, business: 3.5, economy: 1.5 },
  { month: "May", firstClass: 3, business: 4, economy: 3 },
  { month: "June", firstClass: 1.5, business: 4.5, economy: 2.5 },
  { month: "July", firstClass: 4, business: 5, economy: 1 },
  { month: "August", firstClass: 1, business: 5, economy: 1 },
];

// Crear escalas para el eje X y Y
const xStackedBar = d3
  .scaleBand()
  .domain(dataStackedBarChart.map((d) => d.month))
  .range([
    marginStackedBarChart.left,
    baseWidthStackedBarChart - marginStackedBarChart.right,
  ])
  .padding(0.1);

const yStackedBar = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(dataStackedBarChart, (d) => d.firstClass + d.business + d.economy),
  ]) // Valor máximo del eje Y
  .range([
    baseHeightStackedBarChart - marginStackedBarChart.bottom,
    marginStackedBarChart.top,
  ]);

// Seleccionar el SVG para el gráfico de barras apiladas
const svgStackedBar = d3
  .select("#bar-chart-stacked")
  .attr("width", baseWidthStackedBarChart)
  .attr("height", baseHeightStackedBarChart);

// Apilar los datos
const stack = d3.stack().keys(["firstClass", "business", "economy"]);

const stackedData = stack(dataStackedBarChart);

// Dibujar las barras apiladas
svgStackedBar
  .selectAll(".layer")
  .data(stackedData)
  .enter()
  .append("g")
  .attr("class", "layer")
  .attr("fill", (d, i) => {
    const colors = ["#ff4d52", "#4d52ff", "#5bc0de"];
    return colors[i];
  })
  .selectAll("rect")
  .data((d) => d)
  .enter()
  .append("rect")
  .attr("x", (d) => xStackedBar(d.data.month))
  .attr("y", (d) => yStackedBar(d[1]))
  .attr("height", (d) => yStackedBar(d[0]) - yStackedBar(d[1]))
  .attr("width", xStackedBar.bandwidth());

// Eje X para el gráfico de barras apiladas
svgStackedBar
  .append("g")
  .attr(
    "transform",
    `translate(0,${baseHeightStackedBarChart - marginStackedBarChart.bottom})`
  )
  .call(d3.axisBottom(xStackedBar));

// Eje Y para el gráfico de barras apiladas
svgStackedBar
  .append("g")
  .attr("transform", `translate(${marginStackedBarChart.left},0)`)
  .call(
    d3
      .axisLeft(yStackedBar)
      .ticks(6)
      .tickFormat((d) => `${d}M`)
  ); // Formatear ticks como millones

// Leyenda
const legendBarChartStacked = svgStackedBar
  .append("g")
  .attr("transform", `translate(${baseWidthStackedBarChart - 120}, 20)`);

const categories = ["First Class", "Business", "Economy"];
const colors = ["#ff4d52", "#4d52ff", "#5bc0de"];

categories.forEach((category, index) => {
  legendBarChartStacked
    .append("rect")
    .attr("x", 0)
    .attr("y", index * 20)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colors[index]);

  legendBarChartStacked
    .append("text")
    .attr("x", 25)
    .attr("y", index * 20 + 15)
    .text(category);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ BAR CHART HORIZONTAL
// Definir el tamaño del gráfico y los márgenes
const baseWidthHorizontalBarChart = 750; // Ancho total del gráfico
const baseHeightHorizontalBarChart = 400; // Alto total del gráfico
const marginHorizontalBarChart = { top: 20, right: 30, bottom: 30, left: 100 }; // Márgenes

// Datos para el gráfico de barras horizontales (pasajeros por tipo de vuelo)
const dataHorizontalBarChart = [
  { flightType: "Charter", passengers: 30000 },
  { flightType: "International", passengers: 20000 },
  { flightType: "Domestic", passengers: 40000 },
];

// Crear escalas para el eje Y y X
const yHorizontalBar = d3
  .scaleBand()
  .domain(dataHorizontalBarChart.map((d) => d.flightType))
  .range([
    marginHorizontalBarChart.top,
    baseHeightHorizontalBarChart - marginHorizontalBarChart.bottom,
  ])
  .padding(0.1);

const xHorizontalBar = d3
  .scaleLinear()
  .domain([0, d3.max(dataHorizontalBarChart, (d) => d.passengers)]) // Valor máximo del eje X
  .range([
    marginHorizontalBarChart.left,
    baseWidthHorizontalBarChart - marginHorizontalBarChart.right,
  ]);

// Seleccionar el SVG para el gráfico de barras horizontales
const svgHorizontalBar = d3
  .select("#bar-chart-horizontal")
  .attr("width", baseWidthHorizontalBarChart)
  .attr("height", baseHeightHorizontalBarChart);

// Dibujar las barras
svgHorizontalBar
  .selectAll(".bar")
  .data(dataHorizontalBarChart)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("y", (d) => yHorizontalBar(d.flightType))
  .attr("x", marginHorizontalBarChart.left) // Comienza desde el margen izquierdo
  .attr("height", yHorizontalBar.bandwidth())
  .attr(
    "width",
    (d) => xHorizontalBar(d.passengers) - marginHorizontalBarChart.left
  ) // Ajustar el ancho
  .attr("fill", "#4d52ff"); // Color de las barras

// Eje Y para el gráfico de barras horizontales
svgHorizontalBar
  .append("g")
  .attr("transform", `translate(${marginHorizontalBarChart.left}, 0)`) // Mantener el eje Y dentro de los márgenes
  .call(d3.axisLeft(yHorizontalBar));

// Eje X para el gráfico de barras horizontales
svgHorizontalBar
  .append("g")
  .attr(
    "transform",
    `translate(0, ${
      baseHeightHorizontalBarChart - marginHorizontalBarChart.bottom
    })`
  )
  .call(
    d3
      .axisBottom(xHorizontalBar)
      .ticks(10)
      .tickFormat((d) => `${d}`)
  ); // Formatear ticks
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ AREA CHART
// Definir el tamaño del gráfico y los márgenes
const baseWidthAreaChart = 750; // Ancho total del gráfico
const baseHeightAreaChart = 400; // Alto total del gráfico
const marginAreaChart = { top: 20, right: 30, bottom: 50, left: 50 }; // Márgenes

// Datos para el gráfico de área (ejemplo de valores)
const dataAreaChart = [
  { month: "January", value: 1200 },
  { month: "February", value: 1800 },
  { month: "March", value: 2500 },
  { month: "April", value: 3000 },
  { month: "May", value: 4500 },
  { month: "June", value: 4000 },
  { month: "July", value: 3500 },
];

// Crear escalas para el eje X y Y
const xArea = d3
  .scaleBand()
  .domain(dataAreaChart.map((d) => d.month))
  .range([marginAreaChart.left, baseWidthAreaChart - marginAreaChart.right])
  .padding(0.1); // Espaciado entre las barras

const yArea = d3
  .scaleLinear()
  .domain([0, d3.max(dataAreaChart, (d) => d.value)]) // Cambiado el valor mínimo a 0
  .range([baseHeightAreaChart - marginAreaChart.bottom, marginAreaChart.top]);

// Seleccionar el SVG para el gráfico de área
const svgArea = d3
  .select("#area-chart")
  .attr("width", baseWidthAreaChart)
  .attr("height", baseHeightAreaChart);

// Dibujar la cuadrícula en el fondo
svgArea
  .append("g")
  .attr("class", "grid")
  .attr("transform", `translate(${marginAreaChart.left}, 0)`)
  .call(
    d3
      .axisLeft(yArea)
      .ticks(5)
      .tickSize(
        -baseWidthAreaChart + marginAreaChart.right + marginAreaChart.left
      )
      .tickFormat("")
  );

// Crear el área
const area = d3
  .area()
  .x((d) => xArea(d.month) + xArea.bandwidth() / 2) // Centrar el área en las barras
  .y0(yArea(0)) // Base del área en el eje Y
  .y1((d) => yArea(d.value)); // Altura del área según el valor

// Dibujar el área
svgArea
  .append("path")
  .datum(dataAreaChart) // Vínculo de datos
  .attr("class", "area")
  .attr("fill", "#4d52ff") // Color del área
  .attr("d", area); // Definición del área

// Eje X para el gráfico de área
svgArea
  .append("g")
  .attr(
    "transform",
    `translate(0, ${baseHeightAreaChart - marginAreaChart.bottom})`
  )
  .call(d3.axisBottom(xArea));

// Eje Y para el gráfico de área
svgArea
  .append("g")
  .attr("transform", `translate(${marginAreaChart.left}, 0)`)
  .call(d3.axisLeft(yArea));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ SCATTER PLOT
// Definir datos para el gráfico de dispersión
const dataScatterPlot = [
  { age: 10, points: 1, satisfaction: 3 },
  { age: 20, points: 2, satisfaction: 2 },
  { age: 30, points: 4, satisfaction: 5 },
  { age: 40, points: 3, satisfaction: 4 },
  { age: 50, points: 5, satisfaction: 1 },
  { age: 15, points: 4, satisfaction: 5 },
  { age: 25, points: 3, satisfaction: 2 },
  { age: 35, points: 2, satisfaction: 4 },
  { age: 45, points: 1, satisfaction: 3 },
  { age: 55, points: 5, satisfaction: 5 },
];

// Definir márgenes y dimensiones del gráfico
const marginScatterPlot = { top: 20, right: 30, bottom: 50, left: 80 }; // Aumentar margen izquierdo para la leyenda
const widthScatterPlot = 750; // Ancho del gráfico
const heightScatterPlot = 400; // Altura del gráfico

// Crear escalas
const xScale = d3
  .scaleLinear()
  .domain([10, 60]) // Cambiar el rango de edad para que comience en 10
  .range([
    0,
    widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right,
  ]); // Ajustar rango según márgenes

const yScale = d3
  .scaleLinear()
  .domain([0, 5]) // Rango de puntos
  .range([
    heightScatterPlot - marginScatterPlot.top - marginScatterPlot.bottom,
    0,
  ]); // Ajustar rango según márgenes

// Seleccionar el SVG y agregar un grupo para el gráfico
const svgScatterPlot = d3
  .select("#scatter-plot")
  .append("g")
  .attr(
    "transform",
    `translate(${marginScatterPlot.left}, ${marginScatterPlot.top})`
  );

// Agregar cuadrícula de fondo
const gridlinesX = d3.axisBottom(xScale).ticks(5);

const gridlinesY = d3.axisLeft(yScale).ticks(5);

// Crear líneas de cuadrícula X
svgScatterPlot
  .append("g")
  .attr("class", "grid")
  .attr(
    "transform",
    `translate(0, ${heightScatterPlot - marginScatterPlot.bottom})`
  )
  .call(
    gridlinesX
      .tickSize(
        -heightScatterPlot + marginScatterPlot.top + marginScatterPlot.bottom
      )
      .tickFormat("")
  )
  .selectAll(".tick line") // Seleccionar las líneas de la cuadrícula
  .attr("stroke", "#a0a0a0"); // Establecer el color de las líneas de cuadrícula X

// Crear líneas de cuadrícula Y
svgScatterPlot
  .append("g")
  .attr("class", "grid")
  .call(
    gridlinesY
      .tickSize(
        -widthScatterPlot + marginScatterPlot.left + marginScatterPlot.right
      )
      .tickFormat("")
  )
  .selectAll(".tick line") // Seleccionar las líneas de la cuadrícula
  .attr("stroke", "#a0a0a0"); // Establecer el color de las líneas de cuadrícula Y

// Dibujar círculos para el gráfico de dispersión
svgScatterPlot
  .selectAll("circle")
  .data(dataScatterPlot) // Usar dataScatterPlot
  .enter()
  .append("circle")
  .attr("class", "circle")
  .attr("cx", (d) => xScale(d.age)) // Eje X (edad)
  .attr("cy", (d) => yScale(d.points)) // Eje Y (puntos)
  .attr("r", 5); // Radio de los círculos

// Crear eje X
const xAxis = d3
  .axisBottom(xScale)
  .ticks(5) // Número de ticks
  .tickFormat(d3.format("d")); // Formato de los ticks

svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .attr(
    "transform",
    `translate(0, ${heightScatterPlot - marginScatterPlot.bottom})`
  ) // Ajustar posición del eje X
  .call(xAxis)
  .append("text")
  .attr(
    "x",
    (widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right) / 2
  ) // Ajustar posición centrada debajo del gráfico
  .attr("y", 35)
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Age");

// Crear eje Y
const yAxis = d3.axisLeft(yScale).ticks(5); // Número de ticks

svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -50) // Ajustar posición vertical para la leyenda de puntos
  .attr("x", -heightScatterPlot / 2 + 20) // Ajustar posición horizontal
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Points");

// Leyenda
const legendScatter = svgScatterPlot // Usar svgScatterPlot
  .append("g")
  .attr("transform", `translate(${widthScatterPlot - 310}, 30)`); // Mover la leyenda más a la izquierda

legendScatter
  .append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "#ff4d52");

legendScatter
  .append("text")
  .attr("x", 30)
  .attr("y", 15)
  .text("Customer Satisfaction")
  .attr("alignment-baseline", "middle"); // Alinear verticalmente el texto de la leyenda

// Leyenda de "Points" a la izquierda
svgScatterPlot
  .append("text")
  .attr("x", -marginScatterPlot.left / 1.5) // Ajustar posición horizontal
  .attr("y", heightScatterPlot / 2) // Ajustar posición vertical
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Points");

// Leyenda de "Age" debajo del eje X
svgScatterPlot
  .append("text")
  .attr(
    "x",
    (widthScatterPlot - marginScatterPlot.left - marginScatterPlot.right) / 2
  ) // Centrar debajo del gráfico
  .attr("y", heightScatterPlot - marginScatterPlot.bottom + 25) // Posición debajo del eje X
  .attr("class", "axis-label")
  .attr("text-anchor", "middle")
  .text("Age");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ PIE CHART
// Datos del gráfico
const dataPieChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsPieChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthPieChart = 400;
const heightPieChart = 400;
const radiusPieChart = Math.min(widthPieChart, heightPieChart) / 2;

// Seleccionar el SVG y agregar un grupo
const svgPieChart = d3
  .select("#pie-chart")
  .append("g")
  .attr("transform", `translate(${widthPieChart / 2}, ${heightPieChart / 2})`); // Centrar el gráfico

// Crear el generador de segmentos
const pie = d3.pie().value((d) => d.value); // Usar el valor para el pie chart

const arc = d3
  .arc()
  .innerRadius(0) // Para gráfico de pastel, el radio interno es 0
  .outerRadius(radiusPieChart);

// Dibujar segmentos
const arcs = svgPieChart
  .selectAll("arc")
  .data(pie(dataPieChart))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs
  .append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => colorsPieChart[i]); // Asignar color a cada sección

// Leyenda
const legendPieChart = svgPieChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusPieChart - 20}, ${-radiusPieChart + 10})`
  ); // Ajustar posición de la leyenda

dataPieChart.forEach((d, i) => {
  const legendRow = legendPieChart
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsPieChart[i]);

  legendRow
    .append("text")
    .attr("x", 20)
    .attr("y", 15) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendPieChart");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ^ DONUT CHART
// Datos del gráfico
const dataDonutChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

// Colores para las secciones
const colorsDonutChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Azul, Rojo, Azul oscuro

// Dimensiones y radio del gráfico
const widthDonutChart = 400;
const heightDonutChart = 400;
const radiusDonutChart = Math.min(widthDonutChart, heightDonutChart) / 2;

// Seleccionar el SVG y agregar un grupo
const svgDonutChart = d3
  .select("#donut-chart")
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

// Dibujar segmentos
const donutArcs = svgDonutChart
  .selectAll("arc")
  .data(donutPie(dataDonutChart))
  .enter()
  .append("g")
  .attr("class", "arc");

donutArcs
  .append("path")
  .attr("d", arcDonut)
  .attr("fill", (d, i) => colorsDonutChart[i]); // Asignar color a cada sección

// Leyenda
const legendDonutChart = svgDonutChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusDonutChart - 20}, ${-radiusDonutChart + 10})`
  ); // Ajustar posición de la leyenda

dataDonutChart.forEach((d, i) => {
  const legendRow = legendDonutChart
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`); // Espacio entre cada leyenda

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsDonutChart[i]);

  legendRow
    .append("text")
    .attr("x", 20)
    .attr("y", 15) // Ajustar posición del texto
    .text(d.category)
    .attr("class", "legendDonutChart");
});
