/*
 * TotalsVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _ageBracketsEmployedTotals	-- total number of people employed
 * @param _ageBracketsRWTotals			-- total number of people working remotely
 * @param _eventHandler					-- for retrieving start and end dates from the brush event
 *
 * Template for Totals Vis adapted from Lab Week 11
 */

class TotalsVis {
  constructor(
    _parentElement,
    _ageBracketsEmployedTotals,
    _ageBracketsRWTotals,
    _eventHandler
  ) {
    this.parentElement = _parentElement;
    this.ageBracketsEmployedTotals = _ageBracketsEmployedTotals;
    this.ageBracketsRWTotals = _ageBracketsRWTotals;

    this.eventHandler = _eventHandler;

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

    vis.margin = { top: 50, right: 60, bottom: 60, left: 110 };

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

    vis.xAxis = d3
      .axisBottom()
      .scale(vis.x)
      .ticks(29)
      .tickFormat(vis.monthFormatter);

    vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

    // Y Axis title
    vis.svg
      .append("text")
      .attr("x", -250)
      .attr("y", -80)
      .text("Number of people working")
      .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "1.25em");

    // Set domains based on total employed
    let minMaxY = [
      0,
      d3.max(
        vis.ageBracketsEmployedTotals.map(function (d) {
          return d.total;
        })
      ),
    ];

    vis.y.domain(minMaxY);

    let minMaxX = d3.extent(
      vis.ageBracketsEmployedTotals.map(function (d) {
        return d.month;
      })
    );

    vis.x.domain(minMaxX);

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis axis");

    // Append a path for the total employment area function, so that it is later behind the brush overlay
    vis.timePath = vis.svg.append("path").attr("class", "area area-employed");

    // Append a second path for the remote workers area function, so that it is later behind the brush overlay
    vis.timePathRW = vis.svg.append("path").attr("class", "area area-rw");

    // Define the D3 path generator
    vis.area = d3
      .area()
      .curve(d3.curveCardinal)
      .x(function (d) {
        return vis.x(d.month);
      })
      .y0(vis.height)
      .y1(function (d) {
        return vis.y(d.total);
      });

    // Add a legend to differentiate total employed from remote work
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-employed")
      .attr("x", 10)
      .attr("y", -40);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 30)
      .attr("y", -26)
      .text("Total Employed");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-remote")
      .attr("x", 130)
      .attr("y", -40);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 150)
      .attr("y", -26)
      .text("Working Remotely");

    // Display initital range of dates
    let startDate = d3.min(
      vis.ageBracketsEmployedTotals.map(function (d) {
        return d.month;
      })
    );

    let endDate = d3.max(
      vis.ageBracketsEmployedTotals.map(function (d) {
        return d.month;
      })
    );

    d3.select("#time-period-min").text(vis.dateFormatter(startDate));
    d3.select("#time-period-max").text(vis.dateFormatter(endDate));
    d3.select("#time-period-min-age").text(vis.dateFormatter(startDate));
    d3.select("#time-period-max-age").text(vis.dateFormatter(endDate));
    d3.select("#time-period-min-race").text(vis.dateFormatter(startDate));
    d3.select("#time-period-max-race").text(vis.dateFormatter(endDate));

    // Initialize brushing component
    vis.currentBrushRegion = null;
    vis.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [vis.width, vis.height],
      ])
      .on("brush", function (event) {
        // User just selected a specific region
        vis.currentBrushRegion = event.selection;
        vis.currentBrushRegion = vis.currentBrushRegion.map(vis.x.invert);

        // Trigger the event 'selectionChanged' of our event handler
        vis.eventHandler.trigger("selectionChanged", vis.currentBrushRegion);
      });

    // Append brush component here
    vis.brushGroup = vis.svg.append("g").attr("class", "brush").call(vis.brush);

    vis.wrangleData();
  }

  /*
   * Data wrangling
   */

  wrangleData() {
    let vis = this;

    vis.displayData = vis.ageBracketsEmployedTotals;

    vis.displayDataRW = vis.ageBracketsRWTotals;

    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - Update dynamic visualization content
   */

  updateVis() {
    let vis = this;

    // Call the path to generate the area for total employment
    vis.timePath
      .datum(vis.displayData)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");

    // Call the path to generate the area for remote workers
    vis.timePathRW
      .datum(vis.displayDataRW)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");

    // Call axis functions with the new domain
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

    vis.svg.select(".y-axis").call(vis.yAxis);
  }

  onSelectionChange(selectionStart, selectionEnd) {
    let vis = this;

    // Update the HTML to display the selected dates
    d3.select("#time-period-min").text(vis.dateFormatter(selectionStart));
    d3.select("#time-period-max").text(vis.dateFormatter(selectionEnd));
  }
}
