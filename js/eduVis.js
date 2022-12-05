let colors = ["#AAAAAA", "#7FDBFF", "#39CCCC", "#3D9970", "#0074D9"];

class EduVis {
  constructor(parentElement, eduData, ageTotals){
        this.parentElement = parentElement;
        this.dataset = eduData;
        this.ageTotals = ageTotals;

        // Create copies that we can filter later
        this.filteredDataset = eduData;
        this.filteredAgeTotals = ageTotals;

        // We'll need to format dates when they are passed by the brush selection
        this.dateFormatter = d3.timeFormat("%-m/%-d/%Y");

        // We'll need to format the x-axis tick labels
        this.monthFormatter = d3.timeFormat("%b %Y");

        this.initVis()
    }

    initVis() {
      let vis = this;

      vis.margin = { top: 50, right: 60, bottom: 60, left: 100 };

      vis.width =
        document.getElementById(vis.parentElement).getBoundingClientRect().width -
        vis.margin.left -
        vis.margin.right,
      vis.height = 500 - vis.margin.top - vis.margin.bottom;

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

      vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

      // Y Axis title
      vis.svg
        .append("text")
        .attr("x", -300)
        .attr("y", -75)
        .text("Number of people working remotely")
        .attr("transform", "rotate(-90)")
        .style("font-weight", "bold")
        .style("font-size", "1.25em");

      vis.svg
        .append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

      vis.svg.append("g").attr("class", "y-axis axis");

    // add a legend to differentiate total employed from remote work
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-lessHS")
      .attr("x", 0)
      .attr("y", -50);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 30)
      .attr("y", -36)
      .text("Less than High School Diploma");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-hsOnly")
      .attr("x", 0)
      .attr("y", -25);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 30)
      .attr("y", -12)
      .text("High School Diploma Only");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-associate")
      .attr("x", 220)
      .attr("y", -50);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 240)
      .attr("y", -36)
      .text("Some College or Associate Degree");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-bachelors")
      .attr("x", 220)
      .attr("y", -25);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 240)
      .attr("y", -12)
      .text("Bachelor's Degree");

    vis.legend
      .append("rect")
      .attr("class", "legend-rect-advanced")
      .attr("x", 460)
      .attr("y", -25);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 480)
      .attr("y", -12)
      .text("Advanced Degree");

    //  .tickFormat(vis.xAxis.timeFormat("%m"));

    vis.svg.select(".y-axis").call(vis.yAxis);

    // set up stack method
    vis.stack = d3.stack()
      .keys(["lessHS", "hs", "associate", "bachelors", "advanced"]);

    vis.wrangleData();
    }

    wrangleData() {

    let vis = this;

    vis.updateVis();

    }

    updateVis() {

    let vis = this;

    // Set domains based on total remote work
    vis.minMaxY = [
      0,
      d3.max(
        vis.filteredAgeTotals.map(function (d) {
          return d.total;
        })
      ),
    ];
    vis.y.domain(vis.minMaxY);

    vis.x
      .domain([d3.min(vis.filteredAgeTotals.map(function(d){
        return d.month;
        })),
    d3.max(vis.filteredAgeTotals.map(function(d) {
        return d.month;
        }))
    ]);

    vis.xAxis = d3.axisBottom()
      .scale(vis.x)
      .ticks(vis.filteredAgeTotals.length)
      .tickFormat(vis.monthFormatter);

    // Call axis functions with the new domain
    vis.svg.select(".x-axis")
      .call(vis.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-45)";
      });

    //console.log(vis.filteredDataset);
    let series = vis.stack(vis.filteredDataset);
    //console.log("Series: "+ series);

    // Remove all previous rects
    d3.selectAll("g.rect").remove().exit();

    // add a group for each row of data
    let groups = vis.svg.selectAll("g.rects")
      .data(series)
      .enter()
      .append("g")
      .style("fill", function(d,i) {
        return colors[i];
      });

    // add a rect for each data value
    let rects = groups.selectAll("rect")
      .data(function(d) {return d;})
      .enter()
      .append("rect")
      .attr("x", function(d,i) {
        return i*(vis.width / vis.filteredAgeTotals.length) + 1;
      })
      .attr("y", function(d) {
        return vis.y(d[1]);
      })
      .attr("height", function(d) {
        return vis.y(d[0]) - vis.y(d[1]);
      })
    //  .attr("width", vis.x.bandwidth()-10);
      .attr("width", (vis.width / vis.filteredAgeTotals.length)-5);

    }

    onSelectionChange(selectionStart, selectionEnd) {
      let vis = this;

      // Update the HTML to display the selected dates
      d3.select("#time-period-min-edu").text(vis.dateFormatter(selectionStart));
      d3.select("#time-period-max-edu").text(vis.dateFormatter(selectionEnd));

      // Filter original unfiltered data depending on selected time period (brush)
      vis.filteredAgeTotals = vis.ageTotals.filter(function (
        d
      ) {
        return d.month >= selectionStart && d.month <= selectionEnd;
      });

      vis.filteredDataset = vis.dataset.filter(function (
        d
      ) {
        return d.month >= selectionStart && d.month <= selectionEnd;
      });

      vis.wrangleData();
    }
  }
