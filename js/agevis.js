/*
 * AgeVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _ageBracketsRWTotals			-- total number of people working remotely *
 *
 * Guidance for line chart from https://bl.ocks.org/d3noob/bdaf9d5abc467a4895fb115330be35b2
 */

class AgeVis {
  constructor(_parentElement, _ageBracketsRWTotals) {
    this.parentElement = _parentElement;

    this.ageBracketsRWTotals = _ageBracketsRWTotals;

    // create an array of objects to facilitate drawing multiple lines
    // "#AAAAAA", "#7FDBFF", "#39CCCC", "#3D9970", "#0074D9";
    this.lineCategories = [
      {
        ageBracket: "total_RW_16_24",
        legendName: "16-24 RW",
        color: "#0074D9", // blue
      },
      {
        ageBracket: "total_RW_25_34",
        legendName: "25-34 RW",
        color: "#555", // dark grey
      },
      {
        ageBracket: "total_RW_35_44",
        legendName: "35-44 RW",
        color: "#6B9FFE", // light blue
      },
      {
        ageBracket: "total_RW_45_54",
        legendName: "45-54 RW",
        color: "#39CCCC", // teal
      },
      {
        ageBracket: "total_RW_55_64",
        legendName: "55-64 RW",
        color: "#3D9970", // green
      },
      {
        ageBracket: "total_RW_65_UP",
        legendName: "65+ RW",
        color: "#7fdbff", // aqua
      },
    ];

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

    vis.xAxis = d3.axisBottom().scale(vis.x);

    vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis axis");

    // add a legend to differentiate age brackets
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.lineCategories.forEach((lineCategory, i) => {
      vis.legend
        .append("rect")
        .attr("class", "legend-age-lines")
        .style("fill", lineCategory.color)
        .attr("x", 100 * i)
        .attr("y", -30);

      vis.legend
        .append("text")
        .attr("class", "legend-text")
        .attr("x", 100 * i + 25)
        .attr("y", -20)
        .text(lineCategory.legendName);
    });

    // (Filter, aggregate, modify data)
    vis.wrangleData();
  }

  /*
   * Data wrangling
   */

  wrangleData() {
    let vis = this;

    vis.displayDataRW = vis.ageBracketsRWTotals;

    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - should use the D3 update sequence (enter, update, exit)
   * Function parameters only needed if different kinds of updates are needed
   */

  updateVis() {
    let vis = this;

    // Scale the range of the data
    vis.x.domain(
      d3.extent(vis.displayDataRW, function (d) {
        return d.month;
      })
    );
    vis.y.domain([
      0,
      d3.max(vis.displayDataRW, function (d) {
        return Math.max(
          d.total_RW_16_24,
          d.total_RW_25_34,
          d.total_RW_35_44,
          d.total_RW_45_54,
          d.total_RW_65_UP
        );
      }),
    ]);

    vis.lineCategories.forEach((lineCategory) => {
      // define the line path for each age bracket
      let newLine = d3
        .line()
        .x(function (d) {
          return vis.x(d.month);
        })
        .y(function (d) {
          return vis.y(d[lineCategory.ageBracket]);
        });

      // the first path will create a grey outline
      vis.svg
        .append("path")
        .data([vis.displayDataRW])
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "5.5")
        .style("opacity", "0.5")
        .attr("d", newLine);

      // the second path will add the colored line
      vis.svg
        .append("path")
        .data([vis.displayDataRW])
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke", lineCategory.color)
        .style("stroke-width", "5")
        .attr("d", newLine);
    });

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
  }
}
