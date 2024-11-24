"use strict";

// Pie Chart Data and Colors
const dataPieChart = [
  { category: "Economy", value: 25 }, // Pie chart segment: Economy
  { category: "Business", value: 50 }, // Pie chart segment: Business
  { category: "First Class", value: 25 }, // Pie chart segment: First Class
];

const colorsPieChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Colors for the segments: Blue, Red, Dark Blue

// Pie Chart Dimensions and Radius
const widthPieChart = 700; // Width of the pie chart
const heightPieChart = 400; // Height of the pie chart
const radiusPieChart = Math.min(widthPieChart, heightPieChart) / 2; // Radius calculation to fit in the SVG

// Select the SVG element where the chart will be drawn and append an SVG container
const svgPieChart = d3
  .select("#pie-chart") // Select the HTML element with id 'pie-chart'
  .append("svg") // Append an SVG element to that element
  .attr("width", widthPieChart) // Set the width of the SVG
  .attr("height", heightPieChart); // Set the height of the SVG

// Create a group (g) for the pie chart and center it within the SVG
const chartGroup = svgPieChart
  .append("g") // Append a group element for the chart
  .attr(
    "transform",
    `translate(${radiusPieChart + 170}, ${heightPieChart / 2})` // Move the chart to center within the SVG
  );

// Pie generator function and Arc for the pie segments
const pie = d3.pie().value((d) => d.value); // Create pie chart generator using the data values
const arc = d3
  .arc()
  .innerRadius(0) // Set the inner radius (0 for a full pie chart, no hole)
  .outerRadius(radiusPieChart - 20); // Set the outer radius (with some padding)

// Draw pie segments with animation
const arcs = chartGroup
  .selectAll("arc") // Select all arc elements (none initially)
  .data(pie(dataPieChart)) // Bind data to the arc elements
  .enter() // Enter the data (creates new elements)
  .append("g") // Append a group element for each arc
  .attr("class", "arc"); // Set the class for styling

// Append the path for each arc (slice of the pie)
arcs
  .append("path")
  .attr("fill", (d, i) => colorsPieChart[i]) // Set the color for each segment from the colors array
  .attr("d", arc) // Set the path for the arc based on the generator
  .each(function (d) {
    this._current = { startAngle: 0, endAngle: 0 }; // Initial state for the animation
  })
  .transition() // Add a transition effect for the drawing
  .duration(1000) // Set the duration of the transition (1 second)
  .attrTween("d", function (d) {
    const interpolate = d3.interpolate(this._current, d); // Interpolate the angles for smooth animation
    this._current = interpolate(1); // Update the current state of the arc
    return function (t) {
      return arc(interpolate(t)); // Animate the arc by updating the angles
    };
  });

// Add percentage labels to each segment (inside the pie)
arcs
  .append("text")
  .text(
    (d) =>
      `${((d.data.value / d3.sum(dataPieChart, (d) => d.value)) * 100).toFixed(
        1
      )}%` // Calculate and display the percentage for each segment
  )
  .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Position the text at the center of each arc
  .attr("text-anchor", "middle") // Center the text horizontally
  .attr("class", "pie-chart-percentage") // Set a class for styling
  .style("font-size", "18px") // Set the font size
  .style("font-weight", "bold"); // Set the font weight to bold

// Create a separate group for the legend (items explaining each color segment)
const legendGroup = svgPieChart
  .append("g") // Append a new group element for the legend
  .attr("transform", `translate(${radiusPieChart * 2 + 180}, 20)`); // Position the legend to the right of the chart

// Generate the legend
dataPieChart.forEach((d, i) => {
  const legendRow = legendGroup
    .append("g") // Append a group for each legend item
    .attr("transform", `translate(0, ${i * 25})`); // Space between each legend item (25px)

  // Create a colored rectangle for each legend item
  legendRow
    .append("rect")
    .attr("width", 18) // Set the width of the color box
    .attr("height", 18) // Set the height of the color box
    .attr("fill", colorsPieChart[i]); // Set the color based on the pie chart

  // Add the category text next to the color box
  legendRow
    .append("text")
    .attr("x", 25) // Position the text 25px to the right of the color box
    .attr("y", 14) // Adjust vertical position to center the text in the legend row
    .text(d.category) // Set the category text (e.g., Economy, Business, First Class)
    .attr("class", "legendPieChart") // Set a class for styling
    .style("font-size", "18px") // Set font size for the legend text
    .style("font-weight", "bold"); // Make the text bold
});
