/**
 * Chart 2: Create a pie chart to display customer satisfaction
 * Gráfico 2: Crear un gráfico de pastel para mostrar la satisfacción del cliente
 */
export function createSatisfactionPieChart(data) {
  // Set the width and height of the chart
  const width = 500;
  const height = 250;

  // Calculate the radius of the pie chart
  const radius = Math.min(width, height) / 2;

  // Define the color scale for the chart segments
  const color = d3
    .scaleOrdinal()
    .domain(['satisfied', 'neutral or dissatisfied'])
    .range(['#4d52ff', '#ff4d52']);

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
    .select('.pie-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 3},${height / 2})`);

  // Process the satisfaction data to match the pie chart format
  const pieData = processSatisfactionData(data);

  // Create groups for each pie segment
  const arcs = svg
    .selectAll('.arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', 'arc');

  // Add the pie segments (paths)
  arcs
    .append('path')
    .attr('d', arc)
    .attr('fill', (d) => color(d.data.label))
    .attr('stroke', '#fff')
    .style('stroke-width', '2px');

  // Add labels inside the pie segments (percentages)
  arcs
    .append('text')
    .attr('transform', (d) => `translate(${arc.centroid(d)})`)
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text((d) => {
      const percentage = (
        (d.data.value / d3.sum(pieData.map((d) => d.value))) *
        100
      ).toFixed(1);
      return `${percentage}%`; // Display percentage inside the segments
    });

  // Add labels outside the pie chart (voting counts)
  arcs
    .append('text')
    .attr('transform', (d) => {
      const angle = (d.startAngle + d.endAngle) / 2; // Calculate the angle for the label
      const x = (radius + 20) * Math.cos(angle); // Position the text on the x-axis
      const y = (radius + 20) * Math.sin(angle); // Position the text on the y-axis
      return `translate(${x},${y})`;
    })
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'normal')
    .text((d) => d.data.value); // Display the number of votes (quantity of people)

  // Add a title to the pie chart
  svg
    .append('text')
    .attr('x', 0)
    .attr('y', -radius - 15)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Customer Satisfaction');

  // Add the legend outside the pie chart
  const legend = d3
    .select('.legend-container')
    .selectAll('.legend-item')
    .data([
      { label: 'Satisfied', color: '#4d52ff' },
      { label: 'Neutral or Dissatisfied', color: '#ff4d52' },
    ])
    .enter()
    .append('div')
    .attr('class', 'legend-item');

  // Create colored squares and text for each legend item
  legend
    .append('svg')
    .attr('width', 15)
    .attr('height', 15)
    .append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', (d) => d.color);

  legend
    .append('text')
    .attr('x', 20)
    .attr('y', 12)
    .style('font-size', '14px')
    .style('font-weight', 'normal')
    .text((d) => d.label);
}

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
    if (d.satisfaction.trim() === 'satisfied') {
      satisfactionCounts.satisfied++; // Increment satisfied count / Incrementar conteo de satisfechos
    } else if (d.satisfaction.trim() === 'neutral or dissatisfied') {
      satisfactionCounts.neutralOrDissatisfied++; // Increment neutral or dissatisfied count / Incrementar conteo de neutrales o insatisfechos
    }
  });

  // Return formatted data for the pie chart / Devolver datos formateados para el gráfico de pastel
  return [
    { label: 'Satisfied', value: satisfactionCounts.satisfied }, // Satisfied data point / Punto de datos para satisfechos
    {
      label: 'Neutral or Dissatisfied',
      value: satisfactionCounts.neutralOrDissatisfied, // Neutral or dissatisfied data point / Punto de datos para neutrales o insatisfechos
    },
  ];
}
