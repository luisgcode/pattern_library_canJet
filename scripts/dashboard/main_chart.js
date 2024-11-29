"use strict";

// === Cargar los datos del CSV ===
let csvPath = "/scripts/dashboard/customer_satisfaction.csv";

// Cargar el archivo CSV y procesar datos
d3.csv(csvPath)
  .then((data) => {
    console.log("Data loaded successfully:", data);

    // Formatear datos: convertir campos numéricos a números y incluir satisfaction
    const formattedData = data.map((d) => ({
      id: d.id,
      flightDistance: +d["Flight Distance"],
      satisfaction: d.satisfaction,
    }));

    // Crear gráficos
    createDistanceChart(formattedData);
    createSatisfactionPieChart(formattedData);
    createSatisfactoryLevelsChart(data);
    createDelayVsConvenienceChart(data);
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

/**
 * Procesar datos de satisfacción para gráfico de pastel
 */
function processSatisfactionData(data) {
  const satisfactionCounts = {
    satisfied: 0,
    neutralOrDissatisfied: 0,
  };

  data.forEach((d) => {
    if (d.satisfaction.trim() === "satisfied") {
      satisfactionCounts.satisfied++;
    } else if (d.satisfaction.trim() === "neutral or dissatisfied") {
      satisfactionCounts.neutralOrDissatisfied++;
    }
  });

  return [
    { label: "Satisfied", value: satisfactionCounts.satisfied },
    {
      label: "Neutral or Dissatisfied",
      value: satisfactionCounts.neutralOrDissatisfied,
    },
  ];
}

/**
 * Crear gráfico de distancia recorrida por cada cliente.
 */
function createDistanceChart(data) {
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear el contenedor SVG
  const svgContainer = d3
    .select(".line-chart")
    .append("svg")
    .attr("id", "distance-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Definir escalas
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

  // Añadir ejes
  svgContainer
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 5 === 0))
    );
  svgContainer.append("g").call(d3.axisLeft(y));

  // Añadir título al eje X
  svgContainer
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Client ID Numbers");

  // Añadir título al eje Y
  svgContainer
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Distance (km)");

  // Crear línea
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

  // Añadir tooltips
  const tooltip = d3
    .select(".line-chart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("pointer-events", "none");

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
      tooltip
        .html(`Customer ID: ${d.id}<br>Distance: ${d.flightDistance} km`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 60}px`);
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}

/**
 * Crear gráfico de pastel de satisfacción del cliente
 */
function createSatisfactionPieChart(data) {
  const width = 450;
  const height = 250;
  const radius = Math.min(width, height) / 2;

  const color = d3
    .scaleOrdinal()
    .domain(["satisfied", "neutral or dissatisfied"])
    .range(["#66c2a5", "#fc8d62"]);

  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius - 10);

  const svg = d3
    .select(".pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const pieData = processSatisfactionData(data);

  const arcs = svg
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label))
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text((d) => `${d.data.label}: ${d.data.value}`);
}

/**
 * Crear gráfico de niveles de satisfacción por categoría
 */
function createSatisfactoryLevelsChart(data) {
  // Selector de categoría
  const categories = [
    "Checkin service",
    "Ease of Online booking",
    "Gate location",
    "On-board service",
    "Baggage handling", // Asegúrate de que esté presente
  ];

  const categorySelector = d3
    .select(".dashboard-ui-row-categories-chart")
    .append("select")
    .attr("id", "category-selector")
    .style("margin-bottom", "10px")
    .on("change", updateChart);

  categories.forEach((category) => {
    categorySelector.append("option").attr("value", category).text(category);
  });

  // Configuración del gráfico
  const margin = { top: 50, right: 30, bottom: 70, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Crear SVG
  const svg = d3
    .select(".dashboard-ui-row-categories-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Definir escalas
  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Eje X (con valores 0, 1, 2, 3, 4, 5)
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Eje Y (mostrando cantidad de usuarios)
  const yAxis = svg.append("g").call(d3.axisLeft(y));

  // Actualizar el gráfico según la categoría seleccionada
  function updateChart() {
    const category = categorySelector.property("value");

    // Filtrar los datos según la categoría seleccionada
    const ratingsData = data.map((d) => {
      const value = +d[category];
      console.log(`Valor original: ${d[category]}, Convertido: ${value}`);
      return value;
    });

    // Depuración: Imprimir los datos de la categoría seleccionada
    console.log(`Datos para ${category}:`, ratingsData);

    // Filtrar valores NaN y asegurarse de que los ratings estén dentro del rango
    const validRatingsData = ratingsData.filter(
      (d) => !isNaN(d) && d >= 0 && d <= 5
    );

    // Contar cuántos usuarios dieron cada rating
    const ratingCounts = [0, 1, 2, 3, 4, 5].map((rating) => {
      return {
        rating,
        count: validRatingsData.filter((d) => d === rating).length,
      };
    });

    // Depuración: Verificar los conteos de los ratings
    console.log(`Conteos para ${category}:`, ratingCounts);

    // Eliminar ratings con conteo 0
    const filteredRatingCounts = ratingCounts.filter((d) => d.count > 0);

    // Depuración: Verificar los conteos filtrados
    console.log(`Conteos filtrados para ${category}:`, filteredRatingCounts);

    // Ajustar dominio de las escalas
    x.domain(filteredRatingCounts.map((d) => d.rating)); // Usar solo los ratings con conteo > 0
    y.domain([0, d3.max(filteredRatingCounts, (d) => d.count)]); // Eje Y con el máximo número de usuarios

    // Actualizar los ejes
    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));

    // Eliminar las barras anteriores
    svg.selectAll(".bar").remove();

    // Añadir las barras
    svg
      .selectAll(".bar")
      .data(filteredRatingCounts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.rating)) // Posicionar las barras en el eje X según el rating
      .attr("y", (d) => y(d.count)) // Posicionar las barras en el eje Y según el número de usuarios
      .attr("width", x.bandwidth()) // Definir el ancho de las barras
      .attr("height", (d) => height - y(d.count)) // Definir la altura de las barras
      .attr("fill", "#66c2a5");
  }

  // Llamar a la función para inicializar el gráfico con la primera categoría seleccionada
  updateChart();
}

/**
 * Crear gráfico de relación entre minutos totales de retraso y satisfacción.
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
    .attr("transform", `translate(${margin.left},${margin.top})`); // Use backticks here

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

  // Añadir ejes
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`) // Use backticks here
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
    .attr("fill", "#fc8d62")
    .attr("opacity", 0.5) // Añadir transparencia
    .on("mouseover", (event, d) => {
      d3.select(".tooltip")
        .style("opacity", 1)
        .html(`Delay: ${d.delayMinutes} mins<br>Satisfaction: ${d.convenience}`) // Use backticks here
        .style("left", `${event.pageX + 10}px`) // Use backticks here
        .style("top", `${event.pageY - 40}px`); // Use backticks here
    })
    .on("mouseout", () => {
      d3.select(".tooltip").style("opacity", 0);
    });
}
