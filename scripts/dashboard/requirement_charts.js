"use strict";

// === Load the CSV data ===
// === Cargar los datos del CSV ===
const csvPath = "/scripts/dashboard/customer_satisfaction.csv";

// Load CSV file and process data
// Cargar archivo CSV y procesar datos
d3.csv(csvPath)
  .then((data) => {
    console.log("Data loaded successfully:", data);

    // Format data: convert numeric fields to numbers
    // Formatear datos: convertir campos numéricos a números
    const formattedData = data.map((d) => ({
      id: d.id,
      gender: d.Gender,
      customerType: d["Customer Type"],
      age: +d.Age,
      typeOfTravel: d["Type of Travel"],
      class: d.Class,
      flightDistance: +d["Flight Distance"],
      inflightWifiService: +d["Inflight wifi service"],
      departureArrivalConvenience: +d["Departure/Arrival time convenient"],
      easeOfOnlineBooking: +d["Ease of Online booking"],
      gateLocation: +d["Gate location"],
      checkinService: +d["Checkin service"],
      satisfaction: d.satisfaction,
      averageSatisfaction: +d["Average Satisfaction"],
      firstTicketPrice: +d["1st Ticket Price"],
      departureDelay: +d["Departure Delay in Minutes"],
      arrivalDelay: +d["Arrival Delay in Minutes"],
      totalDelay: +d["Total Departure and Arrival Delay in Minutes"],
    }));

    // === Chart 1: Distance travelled by each customer ===
    // === Gráfico 1: Distancia recorrida por cada cliente ===
    createDistanceChart(formattedData);

    // === Chart 2: Proportion of satisfied, neutral, or unsatisfied customers ===
    // === Gráfico 2: Proporción de clientes satisfechos, neutrales o insatisfechos ===
    createSatisfactionProportionChart(formattedData);

    // === Chart 3: Number of satisfactory levels by category ===
    // === Gráfico 3: Niveles de satisfacción por categoría ===
    createCategorySatisfactionChart(formattedData);

    // === Additional charts will follow similar structure ===
    // === Los gráficos adicionales seguirán una estructura similar ===
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

/**
 * === Chart 1: Distance travelled by each customer ===
 * === Gráfico 1: Distancia recorrida por cada cliente ===
 * Line chart with tooltips to display distances.
 * Gráfico de líneas con tooltips para mostrar distancias.
 */
function createDistanceChart(data) {
  const margin = { top: 60, right: 30, bottom: 50, left: 70 }; // Increased left margin for more space
  const width = 1000 - margin.left - margin.right; // This is the width minus the margins
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG container inside the .line-chart div
  const svgContainer = d3
    .select(".line-chart")
    .append("svg")
    .attr("id", "distance-chart") // Add an id for styling
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add title to the top-left corner
  svgContainer
    .append("text")
    .attr("x", 0) // Position the title at the top-left (x = 0)
    .attr("y", -20) // Position it slightly above the chart (adjust y as needed)
    .attr("text-anchor", "start") // Align text to the left
    .attr("class", "chart-title")
    .text("Chart 1: Distance travelled by each customer");

  // Set scales
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.id))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.flightDistance)])
    .nice()
    .range([height, 0]);

  // Add axes
  svgContainer
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => !(i % 10))));

  svgContainer.append("g").call(d3.axisLeft(y));

  // Add axis titles
  svgContainer
    .append("text")
    .attr("x", width / 2) // Position it in the middle of the x-axis
    .attr("y", height + 40) // Position it just below the x-axis
    .attr("text-anchor", "middle") // Center align
    .text("Customer ID");

  svgContainer
    .append("text")
    .attr("transform", "rotate(-90)") // Rotate text to vertical
    .attr("x", -height / 2) // Position vertically centered
    .attr("y", -50) // Adjust as necessary
    .attr("text-anchor", "middle") // Center align
    .text("Flight Distance");

  // Create line
  const line = d3
    .line()
    .x((d) => x(d.id) + x.bandwidth() / 2)
    .y((d) => y(d.flightDistance));

  svgContainer
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add tooltips
  const tooltip = d3
    .select(".line-chart") // Selecciona el contenedor del gráfico directamente
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute") // Asegura que el tooltip sea posicionado absolutamente
    .style("opacity", 0)
    .style("pointer-events", "none"); // Evita que el tooltip interfiera con el evento de ratón

  svgContainer
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.id) + x.bandwidth() / 2)
    .attr("cy", (d) => y(d.flightDistance))
    .attr("r", 5)
    .attr("fill", "#1f77b4")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);

      // Calcular la posición para que el tooltip aparezca en la parte superior derecha
      tooltip
        .html(`Customer ID: ${d.id}<br>Distance: ${d.flightDistance}`)
        .style("left", `${event.pageX + 10}px`) // Posicionar a la derecha del punto
        .style("top", `${event.pageY - 60}px`); // Posicionar arriba del punto
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
