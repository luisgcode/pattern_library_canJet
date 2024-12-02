/**
 * Chart 6 Crear gráfico de clientes desleales basados en precios de boletos
 * Chart 6 Create chart for disloyal customers based on ticket prices
 */
export function createDisloyalCustomersTicketPricesChart(formattedData) {
  // Definir márgenes y dimensiones del gráfico
  // Define the margins and dimensions of the chart
  const margin = { top: 50, right: 30, bottom: 50, left: 100 }; // Aumentar el margen izquierdo / Increase the left margin
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear el contenedor SVG
  // Create the SVG container
  const svg = d3
    .select(".stacked-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left - 35},${margin.top})`); // Mover 20px hacia la izquierda

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

  // Título del eje X
  svg
    .append("text")
    .attr("transform", `translate(${width / 2},${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .text("Client ID"); // Título del eje X / X Axis Title

  // Título del eje Y
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", "-45px")
    .attr("x", 0 - height / 2)
    .style("text-anchor", "middle")
    .text("Ticket Price"); // Título del eje Y / Y Axis Title

  // Crear las barras apiladas
  // Create the stacked bars
  const bars = svg
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
    .attr("width", x.bandwidth()) // Ancho de cada barra según la escala x / Width of each bar based on the x scale
    .attr("opacity", 0) // Iniciar con opacidad 0 para la animación / Start with opacity 0 for animation
    .transition()
    .duration(800)
    .attr("opacity", 1) // Cambiar la opacidad a 1 después de la transición / Change opacity to 1 after transition
    .ease(d3.easeBounceOut); // Efecto de rebote para la animación / Bounce effect for animation
}
