export function createDelayVsConvenienceChart(data) {
  const margin = { top: 50, right: 30, bottom: 70, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(".plot-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

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

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, (d) => d.delayMinutes)])
    .nice()
    .range([0, width]);

  const y = d3.scaleLinear().domain([0, 5]).nice().range([height, 0]);

  // Añadir líneas de cuadrícula horizontales
  const grid = svg
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

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(d3.axisLeft(y));

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

  // Añadir puntos al gráfico
  const dots = svg
    .selectAll(".dot")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => {
      const jitter = (Math.random() - 0.5) * 20;
      const xPos = x(d.delayMinutes) + jitter;
      return Math.max(0, Math.min(xPos, width));
    })
    .attr("cy", (d) => {
      return d.convenience === 0
        ? y(d.convenience) + (Math.random() - 0.5) * 10
        : y(d.convenience);
    })
    .attr("r", 4)
    .attr("fill", "#4d52ff")
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
      d3.select(".tooltip")
        .style("opacity", 1)
        .html(`Delay: ${d.delayMinutes} mins<br>Satisfaction: ${d.convenience}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 40}px`);
    })
    .on("mouseout", () => {
      d3.select(".tooltip").style("opacity", 0);
    });

  // Cambiar color de los dots al seleccionar una opción en el dropdown
  d3.select("#color-dropdown").on("change", function () {
    const selectedColor = this.value;
    dots.attr("fill", selectedColor);
  });
}
