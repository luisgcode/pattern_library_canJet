"use strict";

// Pie Chart Data and Colors
const dataPieChart = [
  { category: "Economy", value: 30 },
  { category: "Business", value: 50 },
  { category: "First Class", value: 20 },
];

const colorsPieChart = ["#5bc0de", "#ff4d52", "#4d52ff"]; // Blue, Red, Dark Blue

// Pie Chart Dimensions and Radius
const widthPieChart = 700;
const heightPieChart = 400;
const radiusPieChart = Math.min(widthPieChart, heightPieChart) / 2;

// Select SVG and append a main group for the chart
const svgPieChart = d3
  .select("#pie-chart")
  .append("svg")
  .attr("width", widthPieChart)
  .attr("height", heightPieChart);

// Create a group for the pie chart and center it
const chartGroup = svgPieChart
  .append("g")
  .attr(
    "transform",
    `translate(${radiusPieChart + 170}, ${heightPieChart / 2})`
  );

// Pie generator function and Arc for the pie segments
const pie = d3.pie().value((d) => d.value);
const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radiusPieChart - 20);

// Draw pie segments with animation
const arcs = chartGroup
  .selectAll("arc")
  .data(pie(dataPieChart))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs
  .append("path")
  .attr("fill", (d, i) => colorsPieChart[i]) // Color for each segment
  .attr("d", arc)
  .each(function (d) {
    this._current = { startAngle: 0, endAngle: 0 };
  }) // Initial state for animation
  .transition() // Animation transition
  .duration(1000) // 1 second duration
  .attrTween("d", function (d) {
    const interpolate = d3.interpolate(this._current, d); // Interpolate the angles
    this._current = interpolate(1); // Update state
    return function (t) {
      return arc(interpolate(t));
    }; // Animate the arc
  });

// Add percentage labels to each segment
arcs
  .append("text")
  .text(
    (d) =>
      `${((d.data.value / d3.sum(dataPieChart, (d) => d.value)) * 100).toFixed(
        1
      )}%`
  )
  .attr("transform", (d) => `translate(${arc.centroid(d)})`) // Position text at the center of each arc
  .attr("text-anchor", "middle") // Center the text horizontally
  .attr("class", "pie-chart-percentage")
  .style("font-size", "14px")
  .style("font-weight", "bold");

// Create a separate group for the legend
const legendGroup = svgPieChart
  .append("g")
  .attr("transform", `translate(${radiusPieChart * 2 + 180}, 20)`); // Position legend to the right

// Generate the legend
dataPieChart.forEach((d, i) => {
  const legendRow = legendGroup
    .append("g")
    .attr("transform", `translate(0, ${i * 25})`); // Space between each legend item

  legendRow
    .append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", colorsPieChart[i]);

  legendRow
    .append("text")
    .attr("x", 25)
    .attr("y", 14) // Adjust text position
    .text(d.category)
    .attr("class", "legendPieChart")
    .style("font-size", "14px")
    .style("font-weight", "bold");
});
