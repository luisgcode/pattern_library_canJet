"use strict";

// Base dimensions and margins
const baseWidthLineChart = 750;
const baseHeightLineChart = 400;
const marginLineChart = { top: 20, right: 30, bottom: 30, left: 40 };

// Example datasets
const datasets = {
  passengers: [
    { date: new Date(2024, 0, 1), value: 1000 },
    { date: new Date(2024, 1, 1), value: 2500 },
    { date: new Date(2024, 2, 1), value: 1000 },
    { date: new Date(2024, 3, 1), value: 2100 },
    { date: new Date(2024, 4, 1), value: 5100 },
  ],
  revenue: [
    { date: new Date(2024, 0, 1), value: 5000 },
    { date: new Date(2024, 1, 1), value: 12000 },
    { date: new Date(2024, 2, 1), value: 15000 },
    { date: new Date(2024, 3, 1), value: 17000 },
    { date: new Date(2024, 4, 1), value: 12000 },
  ],
};

// Initialize chart with default data (passengers)
let currentData = datasets.passengers;

// Scales
const x = d3
  .scaleTime()
  .range([marginLineChart.left, baseWidthLineChart - marginLineChart.right]);
const y = d3
  .scaleLinear()
  .range([baseHeightLineChart - marginLineChart.bottom, marginLineChart.top]);

// Select SVG element
const svg = d3.select("#line-chart");

// Line generator function
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

// Function to update the chart with new data
function updateChart(data) {
  // Update scales
  x.domain(d3.extent(data, (d) => d.date));
  y.domain([0, d3.max(data, (d) => d.value)]).nice();

  // Clear previous chart elements
  svg.selectAll("*").remove();

  // Draw X axis
  svg
    .append("g")
    .attr(
      "transform",
      `translate(0,${baseHeightLineChart - marginLineChart.bottom})`
    )
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%B"))
    );

  // Draw Y axis
  svg
    .append("g")
    .attr("transform", `translate(${marginLineChart.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",.0f")));

  // Draw the line with animation
  const path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#ff4d52")
    .attr("stroke-width", 3)
    .attr("d", line);

  // Animate the drawing of the line
  const totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  // Draw points with animation
  const points = svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.date))
    .attr("cy", (d) => y(d.value))
    .attr("r", 0) // Start with radius 0
    .attr("fill", "#ff4d52")
    .on("mouseover", function (event, d) {
      const [xPos, yPos] = [x(d.date), y(d.value)]; // Coordenadas del punto en el SVG
      const tooltip = d3.select("#tooltip");
      tooltip
        .style("opacity", 1)
        .style("left", `${xPos + marginLineChart.left}px`) // Ajusta según el margen izquierdo
        .style("top", `${yPos + marginLineChart.top}px`) // Ajusta según el margen superior
        .html(`Value: ${d.value.toLocaleString()}`);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    });

  // Animate points to appear
  points
    .transition()
    .delay((d, i) => i * 200) // Delay each point's appearance
    .duration(500)
    .attr("r", 6);
}

// Event listener for dropdown menu to switch datasets
document.getElementById("data-selector").addEventListener("change", (event) => {
  const selectedDataset = event.target.value;
  currentData = datasets[selectedDataset];
  updateChart(currentData);
});

// Initial render of the chart
updateChart(currentData);
