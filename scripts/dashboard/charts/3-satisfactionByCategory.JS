/**
 * Chart 3: Create a chart displaying satisfaction levels by category
 * Gráfico 3: Crear un gráfico que muestra los niveles de satisfacción por categoría
 */
export function createSatisfactoryLevelsChart(data) {
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
    .on("change", updateChart); // Update chart on selection change / Actualizar el gráfico al cambiar la selección

  // Add each category as an option in the dropdown / Agregar cada categoría como opción en el desplegable
  categories.forEach((category) => {
    categorySelector.append("option").attr("value", category).text(category); // Set the value and display text / Configurar el valor y el texto mostrado
  });

  // Set chart dimensions and margins / Configurar dimensiones y márgenes del gráfico
  const margin = { top: 50, right: 30, bottom: 70, left: 40 }; // Reduced the left margin to move the chart left
  const width = 600 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

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
