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
  const width = 500;
  const height = 250;

  // Calculate the radius of the pie chart
  const radius = Math.min(width, height) / 2;

  // Define the color scale for the chart segments
  const color = d3
    .scaleOrdinal()
    .domain(["satisfied", "neutral or dissatisfied"])
    .range(["#4d52ff", "#ff4d52"]);

  // Generate the pie layout for the chart
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  // Define the shape of the pie segments
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 10);

  // Create the SVG container for the pie chart
  const svg = d3
    .select(".pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 3},${height / 2})`);

  // Process the satisfaction data to match the pie chart format
  const pieData = processSatisfactionData(data);

  // Create groups for each pie segment
  const arcs = svg
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Add the pie segments (paths)
  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label))
    .attr("stroke", "#fff")
    .style("stroke-width", "2px");

  // Add labels inside the pie segments (percentages)
  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text((d) => {
      const percentage = (
        (d.data.value / d3.sum(pieData.map((d) => d.value))) *
        100
      ).toFixed(1);
      return `${percentage}%`; // Display percentage inside the segments
    });

  // Add labels outside the pie chart (voting counts)
  arcs
    .append("text")
    .attr("transform", (d) => {
      const angle = (d.startAngle + d.endAngle) / 2; // Calculate the angle for the label
      const x = (radius + 20) * Math.cos(angle); // Position the text on the x-axis
      const y = (radius + 20) * Math.sin(angle); // Position the text on the y-axis
      return `translate(${x},${y})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "normal")
    .text((d) => d.data.value); // Display the number of votes (quantity of people)

  // Add a title to the pie chart
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -radius - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Customer Satisfaction");

  // Add the legend outside the pie chart
  const legend = d3
    .select(".legend-container")
    .selectAll(".legend-item")
    .data([
      { label: "Satisfied", color: "#4d52ff" },
      { label: "Neutral or Dissatisfied", color: "#ff4d52" },
    ])
    .enter()
    .append("div")
    .attr("class", "legend-item");

  // Create colored squares and text for each legend item
  legend
    .append("svg")
    .attr("width", 15)
    .attr("height", 15)
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => d.color);

  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 12)
    .style("font-size", "14px")
    .style("font-weight", "normal")
    .text((d) => d.label);
}

/**
 * Chart 3: Create a chart displaying satisfaction levels by category
 * Gráfico 3: Crear un gráfico que muestra los niveles de satisfacción por categoría
 */
function createSatisfactoryLevelsChart(data) {
  // Define the categories available for selection / Define las categorías disponibles para la selección
  const categories = [
    "Checkin service",
    "Ease of Online booking",
    "Gate location",
    "On-board service",
    "Baggage handling",
  ];

  // Create a dropdown selector for categories / Crear un selector desplegable para las categorías
  const categorySelector = d3
    .select(".bar-chart") // Select the container / Seleccionar el contenedor
    .append("select") // Add a dropdown menu / Agregar un menú desplegable
    .attr("id", "category-selector") // Assign an ID to the selector / Asignar un ID al selector
    .style("position", "absolute") // Set absolute positioning for the selector / Establecer posicionamiento absoluto para el selector
    .style("bottom", "10px") // Set distance from top / Establecer distancia desde la parte superior
    .style("left", "40px") // Set distance from the right / Establecer distancia desde la parte derecha
    .style("margin-bottom", "-15px") // Add spacing below the dropdown / Agregar espacio debajo del desplegable
    .style("padding", "10px 20px") // Add padding for better click area / Agregar relleno para un área de clic más grande
    .style("border-radius", "5px") // Rounded corners / Bordes redondeados

    .style("background-color", "#fff") // White background for the dropdown / Fondo blanco para el desplegable
    .style("color", "#4d52ff") // Set text color to blue / Establecer el color del texto a azul
    .style("font-size", "16px") // Set a modern font size / Establecer un tamaño de fuente moderno
    .style("cursor", "pointer") // Make the cursor pointer when hovering over the dropdown / Hacer que el cursor sea un puntero al pasar sobre el desplegable
    .on("change", updateChart); // Update chart on selection change / Actualizar el gráfico al cambiar la selección

  // Add each category as an option in the dropdown / Agregar cada categoría como opción en el desplegable
  categories.forEach((category) => {
    categorySelector.append("option").attr("value", category).text(category); // Set the value and display text / Configurar el valor y el texto mostrado
  });

  // Set chart dimensions and margins / Configurar dimensiones y márgenes del gráfico
  const margin = { top: 50, right: 30, bottom: 70, left: 40 }; // Reduced the left margin to move the chart left
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create an SVG element for the chart / Crear un elemento SVG para el gráfico
  const svg = d3
    .select(".bar-chart") // Select container / Seleccionar contenedor
    .append("svg") // Append SVG element / Agregar elemento SVG
    .attr("width", width + margin.left + margin.right) // Set SVG width / Establecer ancho del SVG
    .attr("height", height + margin.top + margin.bottom) // Set SVG height / Establecer altura del SVG
    .append("g") // Append group element / Agregar un elemento de grupo
    .attr("transform", `translate(${margin.left},${margin.top})`); // Translate group for margins / Trasladar grupo según los márgenes

  // Define scales for the chart / Definir escalas para el gráfico
  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Add X-axis to the chart / Agregar eje X al gráfico
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add Y-axis to the chart / Agregar eje Y al gráfico
  const yAxis = svg.append("g").call(d3.axisLeft(y));

  // Function to update the chart based on selected category / Función para actualizar el gráfico según la categoría seleccionada
  function updateChart() {
    const category = categorySelector.property("value"); // Get the selected category / Obtener la categoría seleccionada

    // Map data to extract ratings for the selected category / Mapear datos para extraer calificaciones de la categoría seleccionada
    const ratingsData = data.map((d) => +d[category]);

    // Filter out invalid ratings and ensure values are within range / Filtrar calificaciones inválidas y asegurar valores dentro del rango
    const validRatingsData = ratingsData.filter(
      (d) => !isNaN(d) && d >= 0 && d <= 5
    );

    // Count occurrences of each rating (0-5) / Contar ocurrencias de cada calificación (0-5)
    const ratingCounts = [0, 1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: validRatingsData.filter((d) => d === rating).length,
    }));

    // Remove ratings with zero counts / Eliminar calificaciones con conteo cero
    const filteredRatingCounts = ratingCounts.filter((d) => d.count > 0);

    // Update scales based on filtered data / Actualizar escalas según los datos filtrados
    x.domain(filteredRatingCounts.map((d) => d.rating));
    y.domain([0, d3.max(filteredRatingCounts, (d) => d.count)]);

    // Update X and Y axes / Actualizar ejes X e Y
    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));

    // Remove old bars / Eliminar barras antiguas
    svg.selectAll(".bar").remove();

    // Add new bars for the chart / Agregar nuevas barras al gráfico
    svg
      .selectAll(".bar")
      .data(filteredRatingCounts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.rating))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "#4d52ff");
  }

  // Initialize chart with default category / Inicializar gráfico con categoría predeterminada
  updateChart(); // Call update function / Llamar a la función de actualización
}

/**
 * Grafico: 4 Crear gráfico de relación entre minutos totales de retraso y satisfacción.
 * Chart: 4 Create a chart to visualize the relationship between total delay minutes and satisfaction.
 */
function createDelayVsConvenienceChart(data) {
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
    .select(".dashboard-ui-row-satisfaction-chart") // Select the container for the chart
    // Seleccionar el contenedor para el gráfico
    .append("svg") // Add an SVG element to the container
    // Añadir un elemento SVG al contenedor
    .attr("width", width + margin.left + margin.right) // Set the total width including margins
    // Establecer el ancho total, incluyendo los márgenes
    .attr("height", height + margin.top + margin.bottom) // Set the total height including margins
    // Establecer la altura total, incluyendo los márgenes
    .append("g") // Add a group element inside the SVG
    // Añadir un elemento de grupo dentro del SVG
    .attr("transform", `translate(${margin.left},${margin.top})`); // Adjust position based on margins
  // Ajustar la posición basada en los márgenes

  // Filter and process the relevant data
  // Filtrar y procesar los datos relevantes
  const filteredData = data
    .filter((d) => {
      const delayMinutes = +d["Total Departure and Arrival Delay in Minutes"]; // Convert delay data to numeric
      // Convertir los datos de retraso a numéricos
      const satisfaction = +d["Average Satisfaction"]; // Convert satisfaction data to numeric
      // Convertir los datos de satisfacción a numéricos
      return !isNaN(delayMinutes) && !isNaN(satisfaction); // Keep only valid numerical data
      // Mantener solo datos numéricos válidos
    })
    .map((d) => ({
      delayMinutes: +d["Total Departure and Arrival Delay in Minutes"], // Map delay minutes to new property
      // Mapear minutos de retraso a una nueva propiedad
      convenience: +d["Average Satisfaction"], // Map satisfaction to new property
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
    .append("g") // Add a group for the grid lines
    // Añadir un grupo para las líneas de cuadrícula
    .attr("class", "grid") // Assign a class for styling
    // Asignar una clase para estilizar
    .call(d3.axisLeft(y).tickSize(-width).tickFormat("")) // Generate grid lines using the y-axis
    // Generar líneas de cuadrícula usando el eje y
    .call((g) => g.selectAll(".domain").remove()) // Remove the axis domain line
    // Eliminar la línea del dominio del eje
    .call(
      (g) =>
        g
          .selectAll(".tick line") // Select the grid lines
          // Seleccionar las líneas de cuadrícula
          .attr("stroke", "#e0e0e0") // Set a light gray color for the grid lines
          // Establecer un color gris claro para las líneas de cuadrícula
          .attr("stroke-dasharray", "2,2") // Make the lines dashed
      // Hacer que las líneas sean discontinuas
    );

  // Add axes to the chart
  // Añadir ejes al gráfico
  svg
    .append("g") // Add a group for the x-axis
    // Añadir un grupo para el eje x
    .attr("transform", `translate(0,${height})`) // Position the x-axis at the bottom
    // Posicionar el eje x en la parte inferior
    .call(d3.axisBottom(x)); // Render the x-axis
  // Renderizar el eje x
  svg
    .append("g") // Add a group for the y-axis
    // Añadir un grupo para el eje y
    .call(d3.axisLeft(y)); // Render the y-axis
  // Renderizar el eje y

  // Add axis labels
  // Añadir etiquetas a los ejes
  svg
    .append("text") // Add a text element for the x-axis label
    // Añadir un elemento de texto para la etiqueta del eje x
    .attr("x", width / 2) // Center the label horizontally
    // Centrar la etiqueta horizontalmente
    .attr("y", height + 40) // Position the label below the axis
    // Posicionar la etiqueta debajo del eje
    .attr("text-anchor", "middle") // Align text to the middle
    // Alinear el texto al centro
    .text("Total Delay Minutes"); // Set the x-axis label text
  // Establecer el texto de la etiqueta del eje x

  svg
    .append("text") // Add a text element for the y-axis label
    // Añadir un elemento de texto para la etiqueta del eje y
    .attr("transform", "rotate(-90)") // Rotate the label vertically
    // Rotar la etiqueta verticalmente
    .attr("x", -height / 2) // Center the label vertically
    // Centrar la etiqueta verticalmente
    .attr("y", -40) // Position the label to the left of the axis
    // Posicionar la etiqueta a la izquierda del eje
    .attr("text-anchor", "middle") // Align text to the middle
    // Alinear el texto al centro
    .text("Average Satisfaction (0-5)"); // Set the y-axis label text
  // Establecer el texto de la etiqueta del eje y

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
    .attr("r", 4) // Reducir tamaño de los puntos
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
 * Chart 5: Función para crear el gráfico de satisfacción promedio por clase de asiento
 * Chart 5:
 */
function createAverageSatisfactionByClassChart(data) {
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
    .select(".dashboard-ui-row-class-chart") // Seleccionar el elemento donde se añadirá el gráfico / Select the element where the chart will be added
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

/**
 * Chart 6 Crear gráfico de clientes desleales basados en precios de boletos
 * Chart 6 Create chart for disloyal customers based on ticket prices
 */
function createDisloyalCustomersTicketPricesChart(formattedData) {
  // Definir márgenes y dimensiones del gráfico
  // Define the margins and dimensions of the chart
  const margin = { top: 50, right: 30, bottom: 100, left: 60 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear el contenedor SVG
  // Create the SVG container
  const svg = d3
    .select(".dashboard-ui-row-stacked-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Filtrar solo los primeros 15 clientes desleales
  // Filter only the first 15 disloyal customers
  const disloyalCustomers = formattedData
    .filter((d) => d.customerType.toLowerCase() === "disloyal customer")
    .slice(0, 15); // Limitar a los primeros 15 / Limit to the first 15

  console.log("First 15 Disloyal Customers:", disloyalCustomers);

  // Definir la escala x basada en los IDs de los clientes
  // Define the x scale based on customer IDs
  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(disloyalCustomers.map((d) => d.id));

  // Definir la escala y con un dominio fijo
  // Define the y scale with a fixed domain
  const y = d3.scaleLinear().range([height, 0]).domain([0, 2000]); // Y está entre 0 y 2000 / Y is between 0 and 2000

  // Añadir líneas de la cuadrícula horizontal
  // Add horizontal grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat("")) // Llamar a la función de la cuadrícula / Call grid function
    .call((g) => g.selectAll(".domain").remove()) // Eliminar el borde del dominio / Remove domain border
    .call(
      (g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "#e0e0e0") // Color gris claro para las líneas de la cuadrícula / Light gray color for grid lines
          .attr("stroke-dasharray", "2,2") // Líneas discontinuas / Dashed lines
    );

  // Definir la escala de colores para las barras apiladas
  // Define the color scale for the stacked bars
  const color = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3]) // Para apilar los precios de los boletos / For stacking ticket prices
    .range(["#5bc0de", "#4d52ff", "#ff4d52", "#e78ac3"]); // Colores para cada segmento / Colors for each segment

  // Apilar los precios de los boletos de cada cliente
  // Stack ticket prices for each customer
  const stack = d3
    .stack()
    .keys([0, 1, 2, 3]) // Apilando los precios de los boletos (1er, 2do, 3er, 4to) / Stacking ticket prices (1st, 2nd, 3rd, 4th)
    .value((d, key) => d.ticketPrices[key] || 0); // Asignar un valor de 0 si no existe el precio / Assign 0 if price does not exist

  const stackedData = stack(disloyalCustomers); // Apilar los datos / Stack the data

  // Agregar el eje x (ID de los clientes)
  // Add the x axis (Customer IDs)
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)") // Rotar las etiquetas del eje x para mayor legibilidad / Rotate x axis labels for better readability
    .style("text-anchor", "end");

  // Agregar el eje y
  // Add the y axis
  svg.append("g").call(d3.axisLeft(y));

  // Crear las barras apiladas
  // Create the stacked bars
  svg
    .selectAll("g.stack")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "stack")
    .attr("fill", (d, i) => color(i)) // Asignar color a cada pila / Assign color to each stack
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.data.id)) // Posición en el eje x según el ID del cliente / Position on the x axis based on customer ID
    .attr("y", (d) => y(d[1])) // Posición en el eje y según el valor apilado / Position on the y axis based on stacked value
    .attr("height", (d) => y(d[0]) - y(d[1])) // Altura según el valor apilado / Height based on the stacked value
    .attr("width", x.bandwidth()); // Ancho de cada barra según la escala x / Width of each bar based on the x scale
}
