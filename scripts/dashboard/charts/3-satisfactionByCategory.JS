// Modificación en el código de la función 'createSatisfactoryLevelsChart'
export function createSatisfactoryLevelsChart(data) {
  const categories = [
    "Checkin service",
    "Ease of Online booking",
    "Gate location",
    "On-board service",
    "Baggage handling",
  ];

  const chartControls = d3
    .select(".bar-chart")
    .append("div")
    .attr("class", "chart-3-controls");

  chartControls
    .append("label")
    .attr("for", "category-selector")
    .text("Category: ");

  const categorySelector = chartControls
    .append("select")
    .attr("id", "category-selector")
    .on("change", updateChart);

  categories.forEach((category) => {
    categorySelector.append("option").attr("value", category).text(category);
  });

  const margin = { top: 50, right: 30, bottom: 40, left: 60 };
  const width = 600 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3
    .select(".bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  const yAxis = svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .attr("class", "x-axis-title")
    .text("Satisfaction Rating (0 to 5)");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("transform", "rotate(-90)")
    .attr("class", "y-axis-title")
    .text("Number of Responses");

  function updateChart() {
    const category = categorySelector.property("value");

    const ratingsData = data.map((d) => +d[category]);
    const validRatingsData = ratingsData.filter(
      (d) => !isNaN(d) && d >= 0 && d <= 5
    );

    const ratingCounts = [0, 1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: validRatingsData.filter((d) => d === rating).length,
    }));

    const filteredRatingCounts = ratingCounts.filter((d) => d.count > 0);

    x.domain(filteredRatingCounts.map((d) => d.rating));
    y.domain([0, d3.max(filteredRatingCounts, (d) => d.count)]);

    xAxis.transition().duration(500).call(d3.axisBottom(x));
    yAxis.transition().duration(500).call(d3.axisLeft(y));

    const bars = svg.selectAll(".bar").data(filteredRatingCounts);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.rating))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "#4d52ff")
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => height - y(d.count));

    bars
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.rating))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count));

    bars
      .exit()
      .transition()
      .duration(500)
      .attr("y", height)
      .attr("height", 0)
      .remove();
  }

  updateChart();
}
