/**
 * Chart 1: Create a chart to display the distance traveled by each customer.
 * Gráfico 1: Crear un gráfico para mostrar la distancia recorrida por cada cliente.
 */
export function createDistanceChart(data) {
  // Define the margins, width, and height for the chart
  // Definir los márgenes, ancho y alto del gráfico
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };
  const width = 1000 - margin.left - margin.right; // Calculate the usable width / Calcular el ancho utilizable
  const height = 400 - margin.top - margin.bottom; // Calculate the usable height / Calcular el alto utilizable

  // Create the SVG container for the chart
  // Crear el contenedor SVG para el gráfico
  const svgContainer = d3
    .select(".line-chart") // Select the container for the chart / Seleccionar el contenedor del gráfico
    .append("svg") // Append an SVG element / Agregar un elemento SVG
    .attr("id", "distance-chart") // Set the ID of the SVG / Establecer el ID del SVG
    .attr("width", width + margin.left + margin.right) // Set the total width of the SVG / Establecer el ancho total del SVG
    .attr("height", height + margin.top + margin.bottom) // Set the total height of the SVG / Establecer el alto total del SVG
    .append("g") // Append a group element / Agregar un elemento de grupo
    .attr("transform", `translate(${margin.left},${margin.top})`); // Position the group element / Posicionar el elemento de grupo

  // Define scales for the axes
  // Definir las escalas para los ejes
  const x = d3
    .scaleBand() // Create a band scale for the x-axis / Crear una escala de bandas para el eje X
    .domain(data.map((d) => d.id)) // Map each customer ID to the x-axis / Mapear cada ID de cliente al eje X
    .range([0, width]) // Set the range of the x-axis / Establecer el rango del eje X
    .padding(0.1); // Add padding between bars / Agregar espacio entre las barras

  const y = d3
    .scaleLinear() // Create a linear scale for the y-axis / Crear una escala lineal para el eje Y
    .domain([0, d3.max(data, (d) => d.flightDistance)]) // Set the maximum value of the y-axis / Establecer el valor máximo del eje Y
    .nice() // Adjust the scale for better visualization / Ajustar la escala para mejor visualización
    .range([height, 0]); // Invert the y-axis direction (0 at bottom) / Invertir la dirección del eje Y (0 en la parte inferior)

  // Add horizontal grid lines
  // Añadir líneas de cuadrícula horizontales
  svgContainer
    .append("g") // Append a group for the grid / Agregar un grupo para la cuadrícula
    .attr("class", "grid") // Add a class for styling / Agregar una clase para el estilo
    .call(d3.axisLeft(y).tickSize(-width).tickFormat("")) // Create grid lines based on y-axis ticks / Crear líneas de cuadrícula basadas en las marcas del eje Y
    .call((g) => g.selectAll(".domain").remove()) // Remove the axis line / Eliminar la línea del eje
    .call(
      (g) =>
        g
          .selectAll(".tick line") // Select all tick lines / Seleccionar todas las líneas de marcas
          .attr("stroke", "#e0e0e0") // Set grid line color / Establecer color de las líneas de cuadrícula
          .attr("stroke-dasharray", "2,2") // Set dashed line style / Establecer estilo de línea discontinua
    );

  // Add axes to the chart
  // Añadir ejes al gráfico
  svgContainer
    .append("g") // Append a group for the x-axis / Agregar un grupo para el eje X
    .attr("transform", `translate(0,${height})`) // Position x-axis at the bottom / Posicionar el eje X en la parte inferior
    .call(
      d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 5 === 0)) // Show every 5th tick / Mostrar cada quinta marca
    );

  svgContainer.append("g").call(d3.axisLeft(y)); // Add y-axis to the left / Agregar el eje Y a la izquierda

  // Add a label for the x-axis
  // Añadir una etiqueta para el eje X
  svgContainer
    .append("text") // Append a text element / Agregar un elemento de texto
    .attr("x", width / 2) // Center the label / Centrar la etiqueta
    .attr("y", height + 40) // Position the label below the axis / Posicionar la etiqueta debajo del eje
    .attr("text-anchor", "middle") // Center-align the text / Alinear el texto al centro
    .text("Client ID Numbers"); // Set label text / Establecer texto de la etiqueta

  // Add a label for the y-axis
  // Añadir una etiqueta para el eje Y
  svgContainer
    .append("text") // Append a text element / Agregar un elemento de texto
    .attr("transform", "rotate(-90)") // Rotate the label / Rotar la etiqueta
    .attr("x", -height / 2) // Center the label / Centrar la etiqueta
    .attr("y", -50) // Position the label to the left / Posicionar la etiqueta a la izquierda
    .attr("text-anchor", "middle") // Center-align the text / Alinear el texto al centro
    .text("Distance (km)"); // Set label text / Establecer texto de la etiqueta

  // Create a line to connect data points
  // Crear una línea para conectar los puntos de datos
  const line = d3
    .line() // Create a line generator / Crear un generador de líneas
    .x((d) => x(d.id) + x.bandwidth() / 2) // Position based on customer ID / Posicionar según el ID del cliente
    .y((d) => y(d.flightDistance)); // Position based on flight distance / Posicionar según la distancia de vuelo

  svgContainer
    .append("path") // Append a path for the line / Agregar un camino para la línea
    .datum(data) // Bind data to the line / Vincular datos a la línea
    .attr("fill", "none") // No fill color for the line / Sin color de relleno para la línea
    .attr("stroke", "#4d52ff") // Set the line color / Establecer el color de la línea
    .attr("stroke-width", 2) // Set the line thickness / Establecer el grosor de la línea
    .attr("d", line); // Draw the line / Dibujar la línea

  // Add tooltips to display details on hover
  // Añadir tooltips para mostrar detalles al pasar el ratón
  const tooltip = d3
    .select(".line-chart") // Select the container for tooltips / Seleccionar el contenedor para tooltips
    .append("div") // Append a div for the tooltip / Agregar un div para el tooltip
    .attr("class", "tooltip") // Add a class for styling / Agregar una clase para el estilo
    .style("position", "absolute") // Position tooltips absolutely / Posicionar tooltips de forma absoluta
    .style("opacity", 0) // Set initial opacity to invisible / Establecer opacidad inicial como invisible
    .style("pointer-events", "none"); // Disable pointer events / Desactivar eventos de puntero

  svgContainer
    .selectAll(".dot") // Select all dots / Seleccionar todos los puntos
    .data(data) // Bind data to dots / Vincular datos a los puntos
    .enter()
    .append("circle") // Create a circle for each data point / Crear un círculo para cada punto de datos
    .attr("class", "dot") // Add a class for styling / Agregar una clase para el estilo
    .attr("cx", (d) => x(d.id) + x.bandwidth() / 2) // X position of the dot / Posición X del punto
    .attr("cy", (d) => y(d.flightDistance)) // Y position of the dot / Posición Y del punto
    .attr("r", 5) // Radius of the dot / Radio del punto
    .attr("fill", "#4d52ff") // Fill color of the dot / Color de relleno del punto
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1); // Show tooltip / Mostrar tooltip
      tooltip
        .html(`Customer ID: ${d.id}<br>Distance: ${d.flightDistance} km`) // Tooltip content / Contenido del tooltip
        .style("left", `${event.pageX + 10}px`) // Position tooltip near the mouse / Posicionar tooltip cerca del ratón
        .style("top", `${event.pageY - 30}px`); // Position tooltip above the mouse / Posicionar tooltip sobre el ratón
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0); // Hide tooltip / Ocultar tooltip
    });
}
