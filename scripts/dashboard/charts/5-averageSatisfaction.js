/**
 * Chart 5: Función para crear el gráfico de satisfacción promedio por clase de asiento
 * Chart 5:
 */
export function createAverageSatisfactionByClassChart(data) {
  // Agrupar los datos por clase de asiento / Group the data by seat class
  const groupedData = Array.from(
    d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d.averageSatisfaction), // Calcular la satisfacción promedio por clase / Calculate the average satisfaction by class
      (d) => d.class // Agrupar por la clase de asiento / Group by seat class
    ),
    ([key, value]) => ({ key, value }) // Convertir el resultado a un formato más accesible / Convert the result to a more accessible format
  );

  // Ordenar los grupos por clase de asiento si es necesario / Sort the groups by seat class if needed
  groupedData.sort((a, b) => a.key.localeCompare(b.key));

  // Configuración del gráfico / Chart configuration
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }; // Márgenes del gráfico / Chart margins
  const width = 600 - margin.left - margin.right; // Ancho del gráfico / Chart width
  const height = 400 - margin.top - margin.bottom; // Altura del gráfico / Chart height

  // Seleccionar el contenedor del gráfico / Select the chart container
  const svg = d3
    .select(".bar-chart-small") // Seleccionar el elemento donde se añadirá el gráfico / Select the element where the chart will be added
    .append("svg") // Añadir un contenedor SVG / Append an SVG container
    .attr("width", width + margin.left + margin.right) // Establecer el ancho total del gráfico (con márgenes) / Set the total width of the chart (with margins)
    .attr("height", height + margin.top + margin.bottom) // Establecer la altura total del gráfico (con márgenes) / Set the total height of the chart (with margins)
    .append("g") // Añadir un grupo para el contenido del gráfico / Append a group for the chart content
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Trasladar el grupo para tener en cuenta los márgenes / Translate the group to account for the margins

  // Escalas para los ejes / Scales for the axes
  const x = d3
    .scaleBand() // Escala de bandas para el eje X / Band scale for the X axis
    .domain(groupedData.map((d) => d.key)) // Definir el dominio (las clases de asiento) / Define the domain (seat classes)
    .range([0, width]) // Definir el rango del eje X (ancho del gráfico) / Define the range of the X axis (chart width)
    .padding(0.1); // Espaciado entre las barras / Padding between bars

  const y = d3
    .scaleLinear() // Escala lineal para el eje Y / Linear scale for the Y axis
    .domain([0, d3.max(groupedData, (d) => d.value)]) // Definir el dominio (valor máximo de satisfacción) / Define the domain (maximum satisfaction value)
    .nice() // Ajustar el dominio a valores enteros / Adjust the domain to nice integer values
    .range([height, 0]); // Definir el rango del eje Y (altura del gráfico) / Define the range of the Y axis (chart height)

  // Ejes / Axes
  svg
    .append("g") // Añadir un grupo para los ejes / Append a group for the axes
    .selectAll(".x-axis") // Seleccionar los elementos del eje X / Select X axis elements
    .data(groupedData) // Vincular los datos a los elementos / Bind the data to the elements
    .enter()
    .append("text") // Añadir texto para cada clase de asiento / Append text for each seat class
    .attr("class", "x-axis") // Establecer la clase para los textos del eje X / Set the class for the X axis text
    .attr("x", (d) => x(d.key) + x.bandwidth() / 2) // Establecer la posición en X del texto / Set the X position of the text
    .attr("y", height + 30) // Establecer la posición en Y del texto / Set the Y position of the text
    .attr("text-anchor", "middle") // Alinear el texto al centro / Align the text to the center
    .text((d) => d.key); // Establecer el texto como la clase de asiento / Set the text to the seat class name

  svg.append("g").call(d3.axisLeft(y).ticks(5)); // Añadir el eje Y al gráfico / Append the Y axis to the chart

  // Barras para cada clase de asiento / Bars for each seat class
  svg
    .selectAll(".bar") // Seleccionar todos los elementos de barra / Select all bar elements
    .data(groupedData) // Vincular los datos a las barras / Bind the data to the bars
    .enter()
    .append("rect") // Añadir un rectángulo (barra) por cada clase / Append a rectangle (bar) for each class
    .attr("class", "bar") // Establecer la clase para las barras / Set the class for the bars
    .attr("x", (d) => x(d.key)) // Establecer la posición en X de la barra / Set the X position of the bar
    .attr("width", x.bandwidth()) // Establecer el ancho de la barra / Set the width of the bar
    .attr("y", (d) => y(d.value)) // Establecer la posición en Y de la barra / Set the Y position of the bar
    .attr("height", (d) => height - y(d.value)) // Establecer la altura de la barra / Set the height of the bar
    .attr("fill", "#4d52ff"); // Establecer el color de la barra / Set the color of the bar
}
