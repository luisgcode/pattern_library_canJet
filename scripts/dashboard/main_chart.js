"use strict";

// Load the CSV file / Cargar el archivo CSV
let csvPath = "/scripts/dashboard/customer_satisfaction.csv";

// Fetch data from the CSV file / Obtener los datos del archivo CSV
d3.csv(csvPath)
  .then((data) => {
    // Format the data to include ticket prices / Formatear los datos para incluir los precios de boletos
    const formattedData = data.map((d) => ({
      id: d.id, // Unique identifier / Identificador único
      class: d.Class, // Flight class / Clase de vuelo
      averageSatisfaction: +d["Average Satisfaction"], // Convert average satisfaction to a number / Convertir la satisfacción promedio a número
      flightDistance: +d["Flight Distance"], // Convert flight distance to a number / Convertir la distancia de vuelo a número
      satisfaction: d.satisfaction, // Satisfaction level / Nivel de satisfacción
      customerType: d["Customer Type"], // Type of customer (e.g., Loyal or Disloyal) / Tipo de cliente (por ejemplo, Leal o Desleal)
      ticketPrices: [
        +d["1st Ticket Price"] || 0, // Price of the first ticket / Precio del primer boleto
        +d["2nd Ticket Price"] || 0, // Price of the second ticket / Precio del segundo boleto
        +d["3rd Ticket Price"] || 0, // Price of the third ticket / Precio del tercer boleto
        +d["4th Ticket Price"] || 0, // Price of the fourth ticket / Precio del cuarto boleto
      ].map((price) => Math.round(price * 100) / 100), // Round ticket prices to 2 decimal places / Redondear precios de boletos a 2 decimales
    }));

    // Generate existing charts / Generar gráficos existentes
    createDistanceChart(formattedData); // Create chart for flight distance distribution / Crear gráfico de distribución de distancias de vuelo
    createSatisfactionPieChart(formattedData); // Create pie chart for satisfaction levels / Crear gráfico de pastel para niveles de satisfacción
    createSatisfactoryLevelsChart(data); // Create bar chart for satisfaction levels / Crear gráfico de barras para niveles de satisfacción
    createDelayVsConvenienceChart(data); // Create scatter plot for delays vs convenience / Crear gráfico de dispersión para retrasos vs conveniencia
    createAverageSatisfactionByClassChart(formattedData); // Create bar chart for average satisfaction by flight class / Crear gráfico de barras para satisfacción promedio por clase de vuelo

    // Generate new chart for disloyal customers' ticket prices / Generar nuevo gráfico para precios de boletos de clientes desleales
    createDisloyalCustomersTicketPricesChart(formattedData);
  })
  .catch((error) => {
    // Log error if the CSV file cannot be loaded / Registrar error si no se puede cargar el archivo CSV
    console.error("Error loading the CSV file:", error);
  });

/**
 * Process satisfaction data for pie chart / Procesar datos de satisfacción para gráfico de pastel
 */
function processSatisfactionData(data) {
  // Initialize satisfaction counters / Inicializar contadores de satisfacción
  const satisfactionCounts = {
    satisfied: 0, // Count of satisfied customers / Conteo de clientes satisfechos
    neutralOrDissatisfied: 0, // Count of neutral or dissatisfied customers / Conteo de clientes neutrales o insatisfechos
  };

  // Count satisfaction levels / Contar niveles de satisfacción
  data.forEach((d) => {
    if (d.satisfaction.trim() === "satisfied") {
      satisfactionCounts.satisfied++; // Increment satisfied count / Incrementar conteo de satisfechos
    } else if (d.satisfaction.trim() === "neutral or dissatisfied") {
      satisfactionCounts.neutralOrDissatisfied++; // Increment neutral or dissatisfied count / Incrementar conteo de neutrales o insatisfechos
    }
  });

  // Return formatted data for the pie chart / Devolver datos formateados para el gráfico de pastel
  return [
    { label: "Satisfied", value: satisfactionCounts.satisfied }, // Satisfied data point / Punto de datos para satisfechos
    {
      label: "Neutral or Dissatisfied",
      value: satisfactionCounts.neutralOrDissatisfied, // Neutral or dissatisfied data point / Punto de datos para neutrales o insatisfechos
    },
  ];
}

/**
 * Chart 1: Create a chart to display the distance traveled by each customer.
 * Gráfico 1: Crear un gráfico para mostrar la distancia recorrida por cada cliente.
 */
function createDistanceChart(data) {
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

/**
 * Chart 2: Create a pie chart to display customer satisfaction
 * Gráfico 2: Crear un gráfico de pastel para mostrar la satisfacción del cliente
 */
function createSatisfactionPieChart(data) {
  // Set the width and height of the chart
  // Establecer el ancho y la altura del gráfico
  const width = 450;
  const height = 250;

  // Calculate the radius of the pie chart
  // Calcular el radio del gráfico de pastel
  const radius = Math.min(width, height) / 2;

  // Define the color scale for the chart segments
  // Definir la escala de colores para los segmentos del gráfico
  const color = d3
    .scaleOrdinal() // Create an ordinal color scale / Crear una escala de color ordinal
    .domain(["satisfied", "neutral or dissatisfied"]) // Define the categories for the chart / Definir las categorías para el gráfico
    .range(["#ff4d52", "#4d52ff"]); // Set the colors for each category / Establecer los colores para cada categoría

  // Generate the pie layout for the chart
  // Generar el diseño de pastel para el gráfico
  const pie = d3
    .pie() // Create a pie layout / Crear un diseño de pastel
    .value((d) => d.value) // Define the value for each segment / Definir el valor para cada segmento
    .sort(null); // Disable sorting of the segments / Desactivar la ordenación de los segmentos

  // Define the shape of the pie segments
  // Definir la forma de los segmentos del gráfico de pastel
  const arc = d3
    .arc() // Create an arc generator / Crear un generador de arcos
    .innerRadius(0) // Set the inner radius to 0 (complete pie) / Establecer el radio interno a 0 (pastel completo)
    .outerRadius(radius - 10); // Set the outer radius slightly smaller than the chart radius / Establecer el radio externo ligeramente menor al radio del gráfico

  // Create the SVG container for the pie chart
  // Crear el contenedor SVG para el gráfico de pastel
  const svg = d3
    .select(".pie-chart") // Select the container element for the chart / Seleccionar el elemento contenedor del gráfico
    .append("svg") // Append an SVG element / Agregar un elemento SVG
    .attr("width", width) // Set the width of the SVG / Establecer el ancho del SVG
    .attr("height", height) // Set the height of the SVG / Establecer la altura del SVG
    .append("g") // Append a group element to center the chart / Agregar un elemento de grupo para centrar el gráfico
    .attr("transform", `translate(${width / 2},${height / 2})`); // Position the group at the center of the SVG / Posicionar el grupo en el centro del SVG

  // Process the satisfaction data to match the pie chart format
  // Procesar los datos de satisfacción para que coincidan con el formato del gráfico de pastel
  const pieData = processSatisfactionData(data);

  // Create groups for each pie segment
  // Crear grupos para cada segmento del gráfico de pastel
  const arcs = svg
    .selectAll(".arc") // Select all arc elements / Seleccionar todos los elementos de arco
    .data(pie(pieData)) // Bind the processed data to the pie layout / Vincular los datos procesados al diseño de pastel
    .enter() // Create a new group for each data point / Crear un nuevo grupo para cada punto de datos
    .append("g") // Append a group element / Agregar un elemento de grupo
    .attr("class", "arc"); // Add a class for styling / Agregar una clase para el estilo

  // Add the pie segments (paths)
  // Añadir los segmentos del gráfico de pastel (paths)
  arcs
    .append("path") // Append a path for each segment / Agregar un camino para cada segmento
    .attr("d", arc) // Define the path shape using the arc generator / Definir la forma del camino usando el generador de arcos
    .attr("fill", (d) => color(d.data.label)) // Set the fill color based on the segment label / Establecer el color de relleno basado en la etiqueta del segmento
    .attr("stroke", "#fff") // Add a white border to the segments / Añadir un borde blanco a los segmentos
    .style("stroke-width", "2px"); // Set the border thickness / Establecer el grosor del borde

  // Add labels to the pie segments
  // Añadir etiquetas a los segmentos del gráfico de pastel
  arcs
    .append("text") // Append a text element for each segment / Agregar un elemento de texto para cada segmento
    .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Position the text at the centroid of the segment / Posicionar el texto en el centro del segmento
    .attr("dy", ".35em") // Adjust the vertical alignment of the text / Ajustar la alineación vertical del texto
    .style("text-anchor", "middle") // Center-align the text / Alinear el texto al centro
    .style("font-size", "14px") // Set the font size for the labels / Establecer el tamaño de fuente para las etiquetas
    .style("font-weight", "bold") // Set the font weight for the labels / Establecer el peso de fuente para las etiquetas
    .text((d) => `${d.data.label}: ${d.data.value}`); // Display the label and value / Mostrar la etiqueta y el valor

  // Add a title to the pie chart
  // Añadir un título al gráfico de pastel
  svg
    .append("text") // Append a text element for the title / Agregar un elemento de texto para el título
    .attr("x", 0) // Center the title horizontally / Centrar el título horizontalmente
    .attr("y", -radius - 15) // Position the title above the chart / Posicionar el título encima del gráfico
    .attr("text-anchor", "middle") // Center-align the text / Alinear el texto al centro
    .style("font-size", "16px") // Set the font size for the title / Establecer el tamaño de fuente para el título
    .style("font-weight", "bold") // Set the font weight for the title / Establecer el peso de fuente para el título
    .text("Customer Satisfaction"); // Set the title text / Establecer el texto del título
}

/**
 * Chart 3:
 * Gráfico 3: Chart 3 Crear gráfico de niveles de satisfacción por categoría
 */
function createSatisfactoryLevelsChart(data) {
  // Define the categories available for selection / Define las categorías disponibles para la selección
  const categories = [
    "Checkin service", // Category for check-in service / Categoría para el servicio de check-in
    "Ease of Online booking", // Category for online booking / Categoría para la reserva en línea
    "Gate location", // Category for gate location / Categoría para la ubicación de la puerta
    "On-board service", // Category for on-board service / Categoría para el servicio a bordo
    "Baggage handling", // Ensure baggage handling is included / Asegúrate de incluir el manejo de equipaje
  ];

  // Create a dropdown selector for categories / Crear un selector desplegable para las categorías
  const categorySelector = d3
    .select(".dashboard-ui-row-categories-chart") // Select the container / Seleccionar el contenedor
    .append("select") // Add a dropdown menu / Agregar un menú desplegable
    .attr("id", "category-selector") // Assign an ID to the selector / Asignar un ID al selector
    .style("margin-bottom", "10px") // Add spacing below the dropdown / Agregar espacio debajo del desplegable
    .on("change", updateChart); // Update chart on selection change / Actualizar el gráfico al cambiar la selección

  // Add each category as an option in the dropdown / Agregar cada categoría como opción en el desplegable
  categories.forEach((category) => {
    categorySelector.append("option").attr("value", category).text(category); // Set the value and display text / Configurar el valor y el texto mostrado
  });

  // Set chart dimensions and margins / Configurar dimensiones y márgenes del gráfico
  const margin = { top: 50, right: 30, bottom: 70, left: 60 }; // Define margins / Definir márgenes
  const width = 600 - margin.left - margin.right; // Calculate chart width / Calcular ancho del gráfico
  const height = 400 - margin.top - margin.bottom; // Calculate chart height / Calcular altura del gráfico

  // Create an SVG element for the chart / Crear un elemento SVG para el gráfico
  const svg = d3
    .select(".dashboard-ui-row-categories-chart") // Select container / Seleccionar contenedor
    .append("svg") // Append SVG element / Agregar elemento SVG
    .attr("width", width + margin.left + margin.right) // Set SVG width / Establecer ancho del SVG
    .attr("height", height + margin.top + margin.bottom) // Set SVG height / Establecer altura del SVG
    .append("g") // Append group element / Agregar un elemento de grupo
    .attr("transform", `translate(${margin.left},${margin.top})`); // Translate group for margins / Trasladar grupo según los márgenes

  // Define scales for the chart / Definir escalas para el gráfico
  const x = d3.scaleBand().range([0, width]).padding(0.1); // Define X scale (categories) / Definir escala X (categorías)
  const y = d3.scaleLinear().range([height, 0]); // Define Y scale (values) / Definir escala Y (valores)

  // Add X-axis to the chart / Agregar eje X al gráfico
  const xAxis = svg
    .append("g") // Append group element for X-axis / Agregar un grupo para el eje X
    .attr("transform", `translate(0,${height})`) // Position at bottom / Posicionar en la parte inferior
    .call(d3.axisBottom(x)); // Use the bottom axis generator / Usar generador de eje inferior

  // Add Y-axis to the chart / Agregar eje Y al gráfico
  const yAxis = svg.append("g").call(d3.axisLeft(y)); // Use left axis generator / Usar generador de eje izquierdo

  // Function to update the chart based on selected category / Función para actualizar el gráfico según la categoría seleccionada
  function updateChart() {
    const category = categorySelector.property("value"); // Get the selected category / Obtener la categoría seleccionada

    // Map data to extract ratings for the selected category / Mapear datos para extraer calificaciones de la categoría seleccionada
    const ratingsData = data.map((d) => +d[category]); // Convert values to numbers / Convertir valores a números

    // Filter out invalid ratings and ensure values are within range / Filtrar calificaciones inválidas y asegurar valores dentro del rango
    const validRatingsData = ratingsData.filter(
      (d) => !isNaN(d) && d >= 0 && d <= 5 // Remove NaN and out-of-range values / Eliminar NaN y valores fuera de rango
    );

    // Count occurrences of each rating (0-5) / Contar ocurrencias de cada calificación (0-5)
    const ratingCounts = [0, 1, 2, 3, 4, 5].map((rating) => ({
      rating, // Assign the rating value / Asignar el valor de la calificación
      count: validRatingsData.filter((d) => d === rating).length, // Count occurrences / Contar ocurrencias
    }));

    // Remove ratings with zero counts / Eliminar calificaciones con conteo cero
    const filteredRatingCounts = ratingCounts.filter((d) => d.count > 0); // Keep only relevant ratings / Mantener solo calificaciones relevantes

    // Update scales based on filtered data / Actualizar escalas según los datos filtrados
    x.domain(filteredRatingCounts.map((d) => d.rating)); // Update X scale domain / Actualizar dominio de escala X
    y.domain([0, d3.max(filteredRatingCounts, (d) => d.count)]); // Update Y scale domain / Actualizar dominio de escala Y

    // Update X and Y axes / Actualizar ejes X e Y
    xAxis.call(d3.axisBottom(x)); // Redraw X-axis / Redibujar eje X
    yAxis.call(d3.axisLeft(y)); // Redraw Y-axis / Redibujar eje Y

    // Remove old bars / Eliminar barras antiguas
    svg.selectAll(".bar").remove(); // Select and remove previous bars / Seleccionar y eliminar barras anteriores

    // Add new bars for the chart / Agregar nuevas barras al gráfico
    svg
      .selectAll(".bar") // Select bars / Seleccionar barras
      .data(filteredRatingCounts) // Bind data / Vincular datos
      .enter() // Enter new elements / Ingresar nuevos elementos
      .append("rect") // Add rectangle elements / Agregar elementos rectángulo
      .attr("class", "bar") // Assign a class / Asignar una clase
      .attr("x", (d) => x(d.rating)) // Position bars on X-axis / Posicionar barras en el eje X
      .attr("y", (d) => y(d.count)) // Position bars on Y-axis / Posicionar barras en el eje Y
      .attr("width", x.bandwidth()) // Set bar width / Establecer ancho de las barras
      .attr("height", (d) => height - y(d.count)) // Set bar height / Establecer altura de las barras
      .attr("fill", "#4d52ff"); // Set bar color / Establecer color de las barras
  }

  // Initialize chart with default category / Inicializar gráfico con categoría predeterminada
  updateChart(); // Call update function / Llamar a la función de actualización
}

/**
// ^ * Chart 4 Crear gráfico de relación entre minutos totales de retraso y satisfacción.
 */
function createDelayVsConvenienceChart(data) {
  const margin = { top: 50, right: 30, bottom: 70, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear contenedor SVG
  const svg = d3
    .select(".dashboard-ui-row-satisfaction-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Filtrar y procesar datos relevantes
  const filteredData = data
    .filter((d) => {
      const delayMinutes = +d["Total Departure and Arrival Delay in Minutes"];
      const satisfaction = +d["Average Satisfaction"];
      return !isNaN(delayMinutes) && !isNaN(satisfaction);
    })
    .map((d) => ({
      delayMinutes: +d["Total Departure and Arrival Delay in Minutes"],
      convenience: +d["Average Satisfaction"],
    }));

  // Definir escalas
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, (d) => d.delayMinutes)])
    .nice()
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, 5]) // Ajustar dominio para dar espacio
    .nice()
    .range([height, 0]);

  // Añadir grid lines horizontales
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .call((g) => g.selectAll(".domain").remove()) // Eliminar el borde del dominio
    .call(
      (g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#e0e0e0") // Color gris claro para las líneas de grid
          .attr("stroke-dasharray", "2,2") // Líneas discontinuas
    );

  // Añadir ejes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  svg.append("g").call(d3.axisLeft(y));

  // Añadir etiquetas a los ejes
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Total Delay Minutes");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("Average Satisfaction (0-5)");

  // Añadir puntos al gráfico con jittering y transparencia
  svg
    .selectAll(".dot")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => {
      // Añadir un pequeño jittering horizontal aleatorio sin salir de los límites
      const jitter = (Math.random() - 0.5) * 20;
      const xPos = x(d.delayMinutes) + jitter;
      return Math.max(0, Math.min(xPos, width)); // Asegurarse de que el valor de x esté dentro del rango
    })
    .attr("cy", (d) => {
      // Añadir un pequeño jittering vertical para puntos en 0
      return d.convenience === 0
        ? y(d.convenience) + (Math.random() - 0.5) * 10
        : y(d.convenience);
    })
    .attr("r", 3) // Reducir tamaño de los puntos
    .attr("fill", "#4d52ff")
    .attr("opacity", 0.5) // Añadir transparencia
    .on("mouseover", (event, d) => {
      d3.select(".tooltip")
        .style("opacity", 1)
        .html(`Delay: ${d.delayMinutes} mins<br>Satisfaction: ${d.convenience}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 40}px`);
    })
    .on("mouseout", () => {
      d3.select(".tooltip").style("opacity", 0);
    });
}

/**
// ^ * Chart 5 Función para crear el gráfico de satisfacción promedio por clase de asiento
 */
function createAverageSatisfactionByClassChart(data) {
  // Agrupar los datos por clase de asiento
  const groupedData = Array.from(
    d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d.averageSatisfaction),
      (d) => d.class
    ),
    ([key, value]) => ({ key, value })
  );

  // Ordenar los grupos por clase de asiento si es necesario
  groupedData.sort((a, b) => a.key.localeCompare(b.key));

  // Configuración del gráfico
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Seleccionar el contenedor del gráfico
  const svg = d3
    .select(".dashboard-ui-row-class-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Escalas para los ejes
  const x = d3
    .scaleBand()
    .domain(groupedData.map((d) => d.key))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(groupedData, (d) => d.value)])
    .nice()
    .range([height, 0]);

  // Ejes
  svg
    .append("g")
    .selectAll(".x-axis")
    .data(groupedData)
    .enter()
    .append("text")
    .attr("class", "x-axis")
    .attr("x", (d) => x(d.key) + x.bandwidth() / 2)
    .attr("y", height + 30)
    .attr("text-anchor", "middle")
    .text((d) => d.key);

  svg.append("g").call(d3.axisLeft(y).ticks(5));

  // Barras para cada clase de asiento
  svg
    .selectAll(".bar")
    .data(groupedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.key))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => height - y(d.value))
    .attr("fill", "#4d52ff");
}

/**
// ^ * Chart 6 Crear gráfico de clientes desleales basados en precios de boletos
 */
function createDisloyalCustomersTicketPricesChart(formattedData) {
  const margin = { top: 50, right: 30, bottom: 100, left: 60 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear el contenedor SVG
  const svg = d3
    .select(".dashboard-ui-row-stacked-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Filtrar solo los primeros 15 clientes desleales
  const disloyalCustomers = formattedData
    .filter((d) => d.customerType.toLowerCase() === "disloyal customer")
    .slice(0, 15); // Limitar a los primeros 15

  console.log("First 15 Disloyal Customers:", disloyalCustomers);

  // Definir la escala x basada en los IDs de los clientes
  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(disloyalCustomers.map((d) => d.id));

  // Definir la escala y con un dominio fijo (puedes ajustarlo según tus datos)
  const y = d3.scaleLinear().range([height, 0]).domain([0, 2000]); // Y está entre 0 y 2000

  // Añadir grid lines horizontales
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .call((g) => g.selectAll(".domain").remove()) // Eliminar el borde del dominio
    .call(
      (g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#e0e0e0") // Color gris claro para las líneas de grid
          .attr("stroke-dasharray", "2,2") // Líneas discontinuas
    );

  // Definir la escala de colores para las barras apiladas
  const color = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3]) // Para apilar los precios de los boletos
    .range(["#5bc0de", "#4d52ff", "#ff4d52", "#e78ac3"]);

  // Apilar los precios de los boletos de cada cliente
  const stack = d3
    .stack()
    .keys([0, 1, 2, 3]) // Apilando los precios de los boletos (1er, 2do, 3er, 4to)
    .value((d, key) => d.ticketPrices[key] || 0);

  const stackedData = stack(disloyalCustomers);

  // Agregar el eje x (ID de los clientes)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)") // Rotar las etiquetas del eje x para mayor legibilidad
    .style("text-anchor", "end");

  // Agregar el eje y
  svg.append("g").call(d3.axisLeft(y));

  // Crear las barras apiladas
  svg
    .selectAll("g.stack")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "stack")
    .attr("fill", (d, i) => color(i))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.data.id)) // Posición en el eje x según el ID del cliente
    .attr("y", (d) => y(d[1])) // Posición en el eje y según el valor apilado
    .attr("height", (d) => y(d[0]) - y(d[1])) // Altura según el valor apilado
    .attr("width", x.bandwidth()); // Ancho de cada barra (según la escala x)
}
