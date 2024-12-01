/**
 * Grafico: 4 Crear gráfico de relación entre minutos totales de retraso y satisfacción.
 * Chart: 4 Create a chart to visualize the relationship between total delay minutes and satisfaction.
 */
export function createDelayVsConvenienceChart(data) {
  // Define margins for the chart layout
  // Definir márgenes para el diseño del gráfico
  const margin = { top: 50, right: 30, bottom: 70, left: 60 };
  const width = 800 - margin.left - margin.right; // Set the chart width
  // Definir el ancho del gráfico
  const height = 400 - margin.top - margin.bottom; // Set the chart height
  // Definir la altura del gráfico

  // Create the SVG container for the chart
  // Crear el contenedor SVG para el gráfico
  const svg = d3
    .select('.dashboard-ui-row-satisfaction-chart') // Select the container for the chart
    // Seleccionar el contenedor para el gráfico
    .append('svg') // Add an SVG element to the container
    // Añadir un elemento SVG al contenedor
    .attr('width', width + margin.left + margin.right) // Set the total width including margins
    // Establecer el ancho total, incluyendo los márgenes
    .attr('height', height + margin.top + margin.bottom) // Set the total height including margins
    // Establecer la altura total, incluyendo los márgenes
    .append('g') // Add a group element inside the SVG
    // Añadir un elemento de grupo dentro del SVG
    .attr('transform', `translate(${margin.left},${margin.top})`); // Adjust position based on margins
  // Ajustar la posición basada en los márgenes

  // Filter and process the relevant data
  // Filtrar y procesar los datos relevantes
  const filteredData = data
    .filter((d) => {
      const delayMinutes = +d['Total Departure and Arrival Delay in Minutes']; // Convert delay data to numeric
      // Convertir los datos de retraso a numéricos
      const satisfaction = +d['Average Satisfaction']; // Convert satisfaction data to numeric
      // Convertir los datos de satisfacción a numéricos
      return !isNaN(delayMinutes) && !isNaN(satisfaction); // Keep only valid numerical data
      // Mantener solo datos numéricos válidos
    })
    .map((d) => ({
      delayMinutes: +d['Total Departure and Arrival Delay in Minutes'], // Map delay minutes to new property
      // Mapear minutos de retraso a una nueva propiedad
      convenience: +d['Average Satisfaction'], // Map satisfaction to new property
      // Mapear satisfacción a una nueva propiedad
    }));

  // Define scales for the chart
  // Definir escalas para el gráfico
  const x = d3
    .scaleLinear() // Create a linear scale for x-axis (delay minutes)
    // Crear una escala lineal para el eje x (minutos de retraso)
    .domain([0, d3.max(filteredData, (d) => d.delayMinutes)]) // Set domain based on data range
    // Establecer el dominio basado en el rango de los datos
    .nice() // Adjust the domain to nice rounded values
    // Ajustar el dominio a valores redondeados
    .range([0, width]); // Map the domain to the chart width
  // Mapear el dominio al ancho del gráfico

  const y = d3
    .scaleLinear() // Create a linear scale for y-axis (satisfaction)
    // Crear una escala lineal para el eje y (satisfacción)
    .domain([0, 5]) // Set a fixed domain from 0 to 5
    // Establecer un dominio fijo de 0 a 5
    .nice() // Adjust the domain to nice rounded values
    // Ajustar el dominio a valores redondeados
    .range([height, 0]); // Map the domain to the chart height (inverted)
  // Mapear el dominio a la altura del gráfico (invertido)

  // Add horizontal grid lines
  // Añadir líneas de cuadrícula horizontales
  svg
    .append('g') // Add a group for the grid lines
    // Añadir un grupo para las líneas de cuadrícula
    .attr('class', 'grid') // Assign a class for styling
    // Asignar una clase para estilizar
    .call(d3.axisLeft(y).tickSize(-width).tickFormat('')) // Generate grid lines using the y-axis
    // Generar líneas de cuadrícula usando el eje y
    .call((g) => g.selectAll('.domain').remove()) // Remove the axis domain line
    // Eliminar la línea del dominio del eje
    .call(
      (g) =>
        g
          .selectAll('.tick line') // Select the grid lines
          // Seleccionar las líneas de cuadrícula
          .attr('stroke', '#e0e0e0') // Set a light gray color for the grid lines
          // Establecer un color gris claro para las líneas de cuadrícula
          .attr('stroke-dasharray', '2,2') // Make the lines dashed
      // Hacer que las líneas sean discontinuas
    );

  // Add axes to the chart
  // Añadir ejes al gráfico
  svg
    .append('g') // Add a group for the x-axis
    // Añadir un grupo para el eje x
    .attr('transform', `translate(0,${height})`) // Position the x-axis at the bottom
    // Posicionar el eje x en la parte inferior
    .call(d3.axisBottom(x)); // Render the x-axis
  // Renderizar el eje x
  svg
    .append('g') // Add a group for the y-axis
    // Añadir un grupo para el eje y
    .call(d3.axisLeft(y)); // Render the y-axis
  // Renderizar el eje y

  // Add axis labels
  // Añadir etiquetas a los ejes
  svg
    .append('text') // Add a text element for the x-axis label
    // Añadir un elemento de texto para la etiqueta del eje x
    .attr('x', width / 2) // Center the label horizontally
    // Centrar la etiqueta horizontalmente
    .attr('y', height + 40) // Position the label below the axis
    // Posicionar la etiqueta debajo del eje
    .attr('text-anchor', 'middle') // Align text to the middle
    // Alinear el texto al centro
    .text('Total Delay Minutes'); // Set the x-axis label text
  // Establecer el texto de la etiqueta del eje x

  svg
    .append('text') // Add a text element for the y-axis label
    // Añadir un elemento de texto para la etiqueta del eje y
    .attr('transform', 'rotate(-90)') // Rotate the label vertically
    // Rotar la etiqueta verticalmente
    .attr('x', -height / 2) // Center the label vertically
    // Centrar la etiqueta verticalmente
    .attr('y', -40) // Position the label to the left of the axis
    // Posicionar la etiqueta a la izquierda del eje
    .attr('text-anchor', 'middle') // Align text to the middle
    // Alinear el texto al centro
    .text('Average Satisfaction (0-5)'); // Set the y-axis label text
  // Establecer el texto de la etiqueta del eje y

  // Añadir puntos al gráfico con jittering y transparencia
  svg
    .selectAll('.dot')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => {
      // Añadir un pequeño jittering horizontal aleatorio sin salir de los límites
      const jitter = (Math.random() - 0.5) * 20;
      const xPos = x(d.delayMinutes) + jitter;
      return Math.max(0, Math.min(xPos, width)); // Asegurarse de que el valor de x esté dentro del rango
    })
    .attr('cy', (d) => {
      // Añadir un pequeño jittering vertical para puntos en 0
      return d.convenience === 0
        ? y(d.convenience) + (Math.random() - 0.5) * 10
        : y(d.convenience);
    })
    .attr('r', 4) // Reducir tamaño de los puntos
    .attr('fill', '#4d52ff')
    .attr('opacity', 0.5) // Añadir transparencia
    .on('mouseover', (event, d) => {
      d3.select('.tooltip')
        .style('opacity', 1)
        .html(`Delay: ${d.delayMinutes} mins<br>Satisfaction: ${d.convenience}`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 40}px`);
    })
    .on('mouseout', () => {
      d3.select('.tooltip').style('opacity', 0);
    });
}
