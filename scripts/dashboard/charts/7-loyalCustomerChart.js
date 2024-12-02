/**
 * Chart 7 Create a donut chart to show the number of loyal customers.
 */
export function createLoyalCustomerChart(data) {
  // Set the width and height of the chart
  const width = 500;
  const height = 250;

  // Calculate the radius of the donut chart
  const radius = Math.min(width, height) / 2;

  // Define the color scale for the chart segments
  const color = d3
    .scaleOrdinal()
    .domain(["Loyal Customer", "disloyal Customer"])
    .range(["#4d52ff", "#ff4d52"]);

  // Generate the pie layout for the chart
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  // Define the shape of the donut segments
  const arc = d3
    .arc()
    .innerRadius(radius - 50) // Adjust the inner radius to create the donut hole
    .outerRadius(radius - 10);

  // Create the SVG container for the donut chart
  const svg = d3
    .select(".donut-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 3},${height / 2})`);

  // Process the customer type data to match the donut chart format
  const customerCounts = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.customerType
  );

  const pieData = Array.from(customerCounts, ([customerType, count]) => ({
    label: customerType,
    value: count,
  }));

  // Create groups for each donut segment
  const arcs = svg
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Add the donut segments (paths) with animation
  arcs
    .append("path")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(radius - 50)
        .outerRadius(radius - 10)
    )
    .attr("fill", (d) => color(d.data.label))
    .attr("stroke", "#fff")
    .style("stroke-width", "2px")
    .transition() // Add transition
    .duration(1000) // Animation duration in milliseconds
    .attrTween("d", function (d) {
      var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function (t) {
        return arc(interpolate(t));
      };
    });

  // Add labels inside the donut segments (counts) with fade-in animation
  arcs
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("opacity", 0) // Start with opacity 0
    .text((d) => d.data.value)
    .transition() // Add transition
    .delay(1000) // Delay the text appearance
    .duration(500) // Fade-in duration
    .style("opacity", 1); // Fade to full opacity

  // Add a title to the donut chart
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -radius - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Customer Loyalty");

  // Add the legend outside the donut chart
  const legend = d3
    .select(".donut-chart")
    .append("div")
    .attr("class", "legend-container")
    .selectAll(".legend-item")
    .data([
      { label: "Loyal Customer", color: "#4d52ff" },
      { label: "Disloyal Customer", color: "#ff4d52" },
    ])
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin", "5px");

  // Create colored squares and text for each legend item
  legend
    .append("svg")
    .attr("width", 15)
    .attr("height", 15)
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => d.color);

  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 12)
    .style("font-size", "14px")
    .style("font-weight", "normal")
    .text((d) => d.label);
}
