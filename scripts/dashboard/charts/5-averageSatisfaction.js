/**
 * Chart 5: Función para crear el gráfico de satisfacción promedio por clase de asiento
 * Chart 5:
 */
export function createAverageSatisfactionByClassChart(data) {
  // Agrupar los datos por clase de asiento
  const groupedData = Array.from(
    d3.rollup(
      data,
      (v) => d3.mean(v, (d) => d.averageSatisfaction), // Calcular la satisfacción promedio por clase
      (d) => d.class // Agrupar por la clase de asiento
    ),
    ([key, value]) => ({ key, value }) // Convertir el resultado a un formato más accesible
  );

  // Ordenar los grupos por clase de asiento si es necesario
  groupedData.sort((a, b) => a.key.localeCompare(b.key));

  // Configuración del gráfico
  const margin = { top: 20, right: 20, bottom: 40, left: 50 }; // Márgenes del gráfico, se aumenta un poco el margen izquierdo
  const width = 600 - margin.left - margin.right; // Ancho del gráfico
  const height = 400 - margin.top - margin.bottom; // Altura del gráfico

  // Seleccionar el contenedor del gráfico
  const svg = d3
    .select(".bar-chart-small") // Seleccionar el elemento donde se añadirá el gráfico
    .append("svg") // Añadir un contenedor SVG
    .attr("width", width + margin.left + margin.right) // Establecer el ancho total del gráfico (con márgenes)
    .attr("height", height + margin.top + margin.bottom) // Establecer la altura total del gráfico (con márgenes)
    .append("g") // Añadir un grupo para el contenido del gráfico
    .attr(
      "transform",
      "translate(" + (margin.left + 10) + "," + margin.top + ")"
    ); // Trasladar el grupo 10px a la derecha

  // Escalas para los ejes
  const x = d3
    .scaleBand() // Escala de bandas para el eje X
    .domain(groupedData.map((d) => d.key)) // Definir el dominio (las clases de asiento)
    .range([0, width]) // Definir el rango del eje X (ancho del gráfico)
    .padding(0.1); // Espaciado entre las barras

  const y = d3
    .scaleLinear() // Escala lineal para el eje Y
    .domain([0, d3.max(groupedData, (d) => d.value)]) // Definir el dominio (valor máximo de satisfacción)
    .nice() // Ajustar el dominio a valores enteros
    .range([height, 0]); // Definir el rango del eje Y (altura del gráfico)

  // Cambiar los valores del eje Y para mostrar decimales con un paso de 0.5
  const yAxis = d3.axisLeft(y).ticks(10).tickFormat(d3.format(".1f"));

  // Ejes
  svg.append("g").call(yAxis); // Añadir el eje Y al gráfico

  // Eje X
  svg
    .append("g") // Añadir el eje X al gráfico
    .attr("transform", "translate(0," + height + ")") // Posicionar el eje X en la parte inferior
    .call(d3.axisBottom(x)); // Llamar al eje X, sin necesidad de agregar texto manual

  // Añadir etiqueta al eje Y
  svg
    .append("text") // Añadir texto para la etiqueta del eje Y
    .attr("class", "y-axis-label") // Establecer la clase para la etiqueta del eje Y
    .attr("transform", "rotate(-90)") // Rotar la etiqueta para que esté en vertical
    .attr("x", -height / 2) // Posicionar la etiqueta en el eje Y
    .attr("y", -margin.left + 10) // Posicionar la etiqueta en el eje Y
    .style("text-anchor", "middle") // Alinear el texto al centro
    .text("Average Satisfaction"); // Establecer el texto como "Satisfacción Promedio"

  // Barras para cada clase de asiento
  const bars = svg
    .selectAll(".bar") // Seleccionar todos los elementos de barra
    .data(groupedData) // Vincular los datos a las barras
    .enter()
    .append("rect") // Añadir un rectángulo (barra) por cada clase
    .attr("class", "bar") // Establecer la clase para las barras
    .attr("x", (d) => x(d.key)) // Establecer la posición en X de la barra
    .attr("width", x.bandwidth()) // Establecer el ancho de la barra
    .attr("y", height) // Establecer la posición inicial en Y (empezará desde abajo)
    .attr("height", 0) // Establecer la altura inicial de la barra (0, la barra crecerá)
    .attr("fill", "#4d52ff"); // Establecer el color de la barra

  // Animación de las barras
  bars
    .transition() // Iniciar la animación
    .duration(1000) // Duración de la animación en milisegundos
    .attr("y", (d) => y(d.value)) // Cambiar la posición Y de las barras a su valor correcto
    .attr("height", (d) => height - y(d.value)); // Cambiar la altura de las barras
}
