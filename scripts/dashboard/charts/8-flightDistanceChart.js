export function createFlightDistanceChart(data) {
  // Define the margins for the chart
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };

  // Create the SVG container for the chart
  const svgContainer = d3
    .select('.flight-distance') // Select the container for the chart
    .append('svg') // Append an SVG element
    .attr('viewBox', `0 0 1000 400`) // Set the viewBox for responsiveness
    .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio
    .append('g') // Append a group element
    .attr('transform', `translate(${margin.left},${margin.top})`); // Position the group element

  // Calculate the usable width and height
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Define scales for the axes
  const x = d3
    .scaleBand() // Create a band scale for the x-axis
    .domain(data.map((d) => d.id)) // Map each customer ID to the x-axis
    .range([0, width]) // Set the range of the x-axis
    .padding(0.1); // Add padding between bars

  const y = d3
    .scaleLinear() // Create a linear scale for the y-axis
    .domain([0, d3.max(data, (d) => d.flightDistance)]) // Set the maximum value of the y-axis
    .nice() // Adjust the scale for better visualization
    .range([height, 0]); // Invert the y-axis direction (0 at bottom)

  // Add horizontal grid lines
  svgContainer
    .append('g') // Append a group for the grid
    .attr('class', 'grid') // Add a class for styling
    .call(d3.axisLeft(y).tickSize(-width).tickFormat('')) // Create grid lines based on y-axis ticks
    .call((g) => g.selectAll('.domain').remove()) // Remove the axis line
    .call(
      (g) =>
        g
          .selectAll('.tick line') // Select all tick lines
          .attr('stroke', '#e0e0e0') // Set grid line color
          .attr('stroke-dasharray', '2,2') // Set dashed line style
    );

  // Add axes to the chart
  svgContainer
    .append('g') // Append a group for the x-axis
    .attr('transform', `translate(0,${height})`) // Position x-axis at the bottom
    .call(
      d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 5 === 0))
    ); // Add x-axis with ticks in increments of 5

  svgContainer.append('g').call(d3.axisLeft(y)); // Add y-axis to the left

  // Add a label for the x-axis
  svgContainer
    .append('text') // Append a text element
    .attr('x', width / 2) // Center the label
    .attr('y', height + 40) // Position the label below the axis
    .attr('text-anchor', 'middle') // Center-align the text
    .text('Client ID Numbers'); // Set label text

  // Add a label for the y-axis
  svgContainer
    .append('text') // Append a text element
    .attr('transform', 'rotate(-90)') // Rotate the label
    .attr('x', -height / 2) // Center the label
    .attr('y', -50) // Position the label to the left
    .attr('text-anchor', 'middle') // Center-align the text
    .text('Flight Distance (km)'); // Set label text

  // Create the bars for the bar chart
  svgContainer
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.id))
    .attr('y', (d) => y(d.flightDistance))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.flightDistance))
    .attr('fill', '#4d52ff');

  // Add tooltips to display details on hover
  const tooltip = d3
    .select('.flight-distance') // Select the container for tooltips
    .append('div') // Append a div for the tooltip
    .attr('class', 'tooltip') // Add a class for styling
    .style('position', 'absolute') // Position tooltips absolutely
    .style('opacity', 0) // Set initial opacity to invisible
    .style('pointer-events', 'none'); // Disable pointer events

  svgContainer
    .selectAll('.bar')
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 1); // Show tooltip
      tooltip
        .html(`Customer ID: ${d.id}<br>Flight Distance: ${d.flightDistance} km`) // Tooltip content
        .style('left', `${event.pageX + 10}px`) // Position tooltip near the mouse
        .style('top', `${event.pageY - 30}px`); // Position tooltip above the mouse
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0); // Hide tooltip
    });
}
