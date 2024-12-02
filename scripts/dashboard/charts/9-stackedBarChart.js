export function createStackedBarChart(data) {
  // Aggregate data to count customers with and without delays
  const customerCounts = d3.rollup(
    data,
    (v) => ({
      noDelay: v.filter((d) => d.delayInMinutes == 0).length,
      withDelay: v.filter((d) => d.delayInMinutes > 0).length,
    }),
    (d) => d.customerType
  );

  // Convert the aggregated data to an array of objects
  const barData = Array.from(customerCounts, ([customerType, counts]) => ({
    customerType,
    noDelay: counts.noDelay,
    withDelay: counts.withDelay,
  }));

  // Define the dimensions and margins for the chart
  const margin = { top: 60, right: 30, bottom: 50, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG container for the chart
  const svg = d3
    .select(".no-delay-customers")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define the scales for the axes
  const x = d3
    .scaleBand()
    .domain(barData.map((d) => d.customerType))
    .range([0, width])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(barData, (d) => d.noDelay + d.withDelay)])
    .nice()
    .range([height, 0]);

  // Add the x-axis to the chart
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add the y-axis to the chart
  svg.append("g").call(d3.axisLeft(y));

  // Add bars to the chart with animation
  const bars = svg
    .selectAll(".bar")
    .data(barData)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => `translate(${x(d.customerType)},0)`);

  bars
    .selectAll("rect")
    .data((d) => [
      { key: "noDelay", value: d.noDelay },
      { key: "withDelay", value: d.withDelay },
    ])
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i * x.bandwidth()) / 2)
    .attr("y", height) // Start from the bottom
    .attr("width", x.bandwidth() / 2)
    .attr("height", 0) // Start with height 0
    .attr("fill", (d) => (d.key === "noDelay" ? "#4d52ff" : "#ff4d52"))
    .transition() // Add transition
    .duration(1000) // Animation duration in milliseconds
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => height - y(d.value));

  // Add labels to the bars with fade-in animation
  bars
    .selectAll(".label")
    .data((d) => [
      { key: "noDelay", value: d.noDelay },
      { key: "withDelay", value: d.withDelay },
    ])
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d, i) => (i * x.bandwidth()) / 2 + x.bandwidth() / 4)
    .attr("y", (d) => y(d.value) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("opacity", 0) // Start with opacity 0
    .text((d) => d.value)
    .transition() // Add transition
    .delay(1000) // Delay the text appearance
    .duration(500) // Fade-in duration
    .style("opacity", 1); // Fade to full opacity

  // Add a legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 150},${-margin.top / 2})`);

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#4d52ff");

  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 12)
    .style("font-size", "12px")
    .text("No Delay");

  legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#ff4d52");

  legend
    .append("text")
    .attr("x", 20)
    .attr("y", 32)
    .style("font-size", "12px")
    .text("With Delay");
}
