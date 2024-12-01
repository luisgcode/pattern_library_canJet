export function createDistanceChart(data) {
  // Define the margins, width, and height for the chart
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };
  const width = 1000 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG container for the chart
  const svgContainer = d3
    .select(".line-chart")
    .append("svg")
    .attr("id", "distance-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales for the axes
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

  // Add horizontal grid lines
  svgContainer
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .call((g) => g.selectAll(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "2,2")
    );

  // Add axes to the chart
  svgContainer
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 5 === 0))
    );

  svgContainer.append("g").call(d3.axisLeft(y));

  // Add a label for the x-axis
  svgContainer
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Client ID Numbers");

  // Add a label for the y-axis
  svgContainer
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Distance (km)");

  // Create a line to connect data points
  const line = d3
    .line()
    .x((d) => x(d.id) + x.bandwidth() / 2)
    .y((d) => y(d.flightDistance));

  const path = svgContainer
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#4d52ff")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Animate the line
  const totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000) // Duration of the animation
    .ease(d3.easeCubicInOut) // Easing function
    .attr("stroke-dashoffset", 0)
    .on("end", () => {
      // Add animated dots after the line animation completes
      svgContainer
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => x(d.id) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.flightDistance))
        .attr("r", 0) // Start with radius 0
        .attr("fill", "#4d52ff")
        .transition()
        .duration(500) // Animation duration for the dots
        .attr("r", 5); // Final radius of the dots
    });
}
