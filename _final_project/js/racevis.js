/*
 * RaceVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param __raceGroupProportions	-- proportion of each race that is working remotely
 *
 * Guidance for grouped bar chart from https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
 * code for axes adapted from Lab Week 11
 *
 */

class RaceVis {
  constructor(_parentElement, _raceGroupProportions) {
    this.parentElement = _parentElement;

    this.raceGroupProportions = _raceGroupProportions;

    this.initVis();
  }

  /*
   * Initialize visualization (static content, e.g. SVG area or axes)
   */

  initVis() {
    let vis = this;

    vis.margin = { top: 50, right: 20, bottom: 60, left: 60 };

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
    vis.x = d3.scaleTime().range([0, vis.width]);

    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.xAxis = d3.axisBottom().scale(vis.x).ticks(29);

    vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

    // Set domains based on proportions of each race group employed
    let minMaxY = [
      0,
      d3.max(
        vis.raceGroupProportions.map(function (d) {
          return Math.max(d.Asian, d.White, d.Black, d.Hispanic);
        })
      ),
    ];

    vis.y.domain(minMaxY);

    let minMaxX = d3.extent(
      vis.raceGroupProportions.map(function (d) {
        return d.month;
      })
    );

    vis.x.domain(minMaxX);

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(10," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis axis");

    // (Filter, aggregate, modify data)
    vis.wrangleData();
  }

  /*
   * Data wrangling
   */

  wrangleData() {
    let vis = this;

    vis.displayDataRace = vis.raceGroupProportions;

    // groups will hold the dates 
    // one group (or column) per date from the csv
    vis.groups = [];

    vis.displayDataRace.forEach((group) => {
      vis.groups.push(group.month);
    });

    // Subgroups will be the bars for the four different race groups
    vis.subgroups = ["Asian", "White", "Black", "Hispanic"];

    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - should use the D3 update sequence (enter, update, exit)
   * Function parameters only needed if different kinds of updates are needed
   */

  updateVis() {
    let vis = this;

    // adjust X axis
    vis.svg.append("g").attr("transform", `translate(0, ${vis.height})`);

    // adjust X axis labels
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

    // adjust Y axis
    vis.svg.append("g").call(d3.axisLeft(vis.y));

    // additional scale for subgroup position
    const xSubgroup = d3
      .scaleBand()
      .domain(vis.subgroups)
      .range([0, vis.width / 29 - vis.margin.right])
      .padding([0.3]);

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain(vis.subgroups)
      // .range(["green", "magenta", "blue", "maroon"]);
      //      green       teal       blue      aqua
      .range(["#3D9970", "#39CCCC", "#0074D9", "#7FDBFF"]);

    // add a legend to differentiate race groups
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.subgroups.forEach((subgroup, i) => {
      vis.legend
        .append("rect")
        .attr("class", "legend-age-lines")
        .style("fill", color(subgroup))
        .attr("x", 100 * i)
        .attr("y", -30);

      vis.legend
        .append("text")
        .attr("class", "legend-text")
        .attr("x", 100 * i + 25)
        .attr("y", -20)
        .text(subgroup);
    });

    // Show the bars
    vis.svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(this.displayDataRace)
      .join("g")
      .attr("transform", (d) => `translate(${vis.x(d.month)}, 0)`)
      .selectAll("rect")
      .data(function (d) {
        return vis.subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => vis.y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => vis.height - vis.y(d.value))
      .style("fill", (d) => color(d.key))
      .style("stroke", "#aaa");
  }
}
