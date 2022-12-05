/*
 * RaceVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param __raceGroupProportions	-- proportion of each race that is working remotely
 *
 * Guidance for grouped bar chart from https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
 * Code for axes adapted from Lab Week 11
 */

class RaceVis {
  constructor(_parentElement, _raceGroupProportions) {
    this.parentElement = _parentElement;
    this.raceGroupProportions = _raceGroupProportions;

    // Create a copy that we can filter later
    this.filteredRaceGroupProportions = _raceGroupProportions;

    // We'll need to format dates when they are passed by the brush selection
    this.dateFormatter = d3.timeFormat("%-m/%-d/%Y");

    // We'll need to format the x-axis tick labels
    this.monthFormatter = d3.timeFormat("%b %Y");

    this.initVis();
  }

  /*
   * Initialize visualization (static content, e.g. SVG area or axes)
   */

  initVis() {
    let vis = this;

    vis.margin = { top: 50, right: 60, bottom: 60, left: 75 };

    (vis.width =
      document.getElementById(vis.parentElement).getBoundingClientRect().width -
      vis.margin.left -
      vis.margin.right),
      (vis.height = 500 - vis.margin.top - vis.margin.bottom);

    // SVG drawing area
    vis.svg = d3
      .select("#" + vis.parentElement)
      .append("svg")
      .attr("width", vis.width + vis.margin.left + vis.margin.right)
      .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + vis.margin.left + "," + vis.margin.top + ")"
      );

    // Scales and axes
    vis.x = d3.scaleBand().range([0, vis.width]).padding([0.2]);

    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

    // Y Axis title
    vis.svg
      .append("text")
      .attr("x", -250)
      .attr("y", -50)
      .text("Percent of remote workforce")
      .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "1.25em");

    // Set Y axis domain based on proportions of each race group employed
    let minMaxY = [
      0,
      d3.max(
        vis.raceGroupProportions.map(function (d) {
          return Math.max(d.Asian, d.White, d.Black, d.Hispanic);
        })
      ),
    ];

    vis.y.domain(minMaxY);

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis axis");

    // Adjust Y axis
    vis.svg.append("g").call(d3.axisLeft(vis.y));

    // Subgroups will be the bars for the four different race groups
    vis.subgroups = ["Asian", "White", "Black", "Hispanic"];

    // Color palette = one color per subgroup
    vis.color = d3
      .scaleOrdinal()
      .domain(vis.subgroups)
      //      green       teal       blue      grey
      .range(["#3D9970", "#39CCCC", "#0074D9", "#AAAAAA"]);

    // Add a legend to differentiate race groups
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.subgroups.forEach((subgroup, i) => {
      vis.legend
        .append("rect")
        .attr("class", "legend-rect-race")
        .style("fill", vis.color(subgroup))
        .attr("x", 100 * i)
        .attr("y", -30);

      vis.legend
        .append("text")
        .attr("class", "legend-text")
        .attr("x", 100 * i + 25)
        .attr("y", -20)
        .text(subgroup);
    });

    vis.wrangleData();
  }

  /*
   * Data wrangling
   */

  wrangleData() {
    let vis = this;

    vis.displayDataRace = vis.filteredRaceGroupProportions;

    // Groups will hold the dates
    // One group (or column) per date from the csv
    vis.groups = [];

    vis.displayDataRace.forEach((group) => {
      vis.groups.push(group.month);
    });

    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - Update dynamic visualization content
   */

  updateVis() {
    let vis = this;

    // Set Y axis domain based on groups which are the dates from the dataset
    vis.x.domain(vis.groups);

    // Set number of ticks to the number of dates in the selection and adjust tick format
    vis.xAxis = d3
      .axisBottom()
      .scale(vis.x)
      .ticks(vis.groups.length)
      .tickFormat(vis.monthFormatter);

    // Adjust X axis labels
    vis.svg
      .select(".x-axis")
      .call(vis.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-45)";
      });

    // Additional scale for subgroup position
    const xSubgroup = d3
      .scaleBand()
      .domain(vis.subgroups)
      .range([0, (vis.width - vis.margin.right) / vis.groups.length])
      .padding([0.2]);

    // Remove all previous groups of bars
    d3.selectAll(".group").remove();

    // Show the bars
    vis.svg
      .append("g")
      .attr("class", "group")
      .selectAll(".group")
      // Enter in data = loop group per group
      .data(vis.displayDataRace)
      .join("g")
      .attr("transform", (d) => `translate(${vis.x(d.month)}, 0)`)
      .selectAll("rect")
      .data(function (d) {
        return vis.subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      // Draw one rect per subgroup (race)
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => vis.y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => vis.height - vis.y(d.value))
      .style("fill", (d) => vis.color(d.key))
      // Add an outline to the bars
      .style("stroke", "#555");
  }

  onSelectionChange(selectionStart, selectionEnd) {
    let vis = this;

    // Update the HTML to display the selected dates
    d3.select("#time-period-min-race").text(vis.dateFormatter(selectionStart));
    d3.select("#time-period-max-race").text(vis.dateFormatter(selectionEnd));

    // Filter original unfiltered data depending on selected time period (brush)
    vis.filteredRaceGroupProportions = vis.raceGroupProportions.filter(
      function (d) {
        return d.month >= selectionStart && d.month <= selectionEnd;
      }
    );

    vis.wrangleData();
  }
}
