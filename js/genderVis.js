class GenderVis {
  constructor(parentElement, maleTotalEmp, femaleTotalEmp, maleRemote, femaleRemote){
        this.parentElement = parentElement;
        this.maleTot = maleTotalEmp;
        this.femaleTot = femaleTotalEmp;
        this.maleRem = maleRemote;
        this.femaleRem = femaleRemote;

        // We'll need to format dates when they are passed by the brush selection
        this.dateFormatter = d3.timeFormat("%-m/%-d/%Y");

        // We'll need to format the x-axis tick labels
        this.monthFormatter = d3.timeFormat("%b %Y");

        // Create copies that we can filter later
        this.filteredMaleTot = maleTotalEmp;
        this.filteredFemaleTot = femaleTotalEmp;
        this.filteredMaleRem = maleRemote;
        this.filteredFemaleRem = femaleRemote;

        this.initVis()
    }

  initVis() {
    let vis = this;

    vis.margin = { top: 50, right: 60, bottom: 60, left: 100 };

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

    vis.yAxis = d3.axisLeft().scale(vis.y).ticks(5);

    // Y Axis title
    vis.svg
      .append("text")
      .attr("x", -250)
      .attr("y", -75)
      .text("Number of workers")
      .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "1.25em");

    vis.svg
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g").attr("class", "y-axis axis");

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


    // add a legend to differentiate total employed from remote work
    vis.legend = vis.svg.append("g").attr("class", "legend");

    vis.legend
      .append("rect")
      .attr("class", "legend-m-rect-employed")
      .attr("x", 5)
      .attr("y", -50);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 30)
      .attr("y", -36)
      .text("Total Employed - Male");

    vis.legend
      .append("rect")
      .attr("class", "legend-m-rect-remote")
      .attr("x", 5)
      .attr("y", -25);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 30)
      .attr("y", -12)
      .text("Working Remotely - Male");

    vis.legend
      .append("rect")
      .attr("class", "legend-f-rect-employed")
      .attr("x", 180)
      .attr("y", -50);

    vis.legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 203)
      .attr("y", -36)
      .text("Total Employed - Female");

      vis.legend
        .append("rect")
        .attr("class", "legend-f-rect-remote")
        .attr("x", 180)
        .attr("y", -25);

      vis.legend
        .append("text")
        .attr("class", "legend-text")
        .attr("x", 203)
        .attr("y", -12)
        .text("Working Remotely - Female");


    // (Filter, aggregate, modify data)
    vis.wrangleData();
  }


  wrangleData() {

    let vis = this;


    // Update the visualization
    vis.updateVis();
  }

  /*
   * The drawing function - should use the D3 update sequence (enter, update, exit)
   * Function parameters only needed if different kinds of updates are needed
   */

  updateVis() {
   let vis = this;

   // Set domains based on total employed males
   let minMaxY = [
     0,
     d3.max(
       vis.filteredMaleTot.map(function (d) {
         return d.total;
       })
     ),
   ];
   vis.y.domain(minMaxY);

   let minMaxX = d3.extent(
     vis.filteredMaleTot.map(function (d) {
       return d.month;
     })
   );

  vis.x.domain(minMaxX);

  vis.xAxis = d3.axisBottom()
    .scale(vis.x)
    .ticks(vis.filteredMaleTot.length)
    .tickFormat(vis.monthFormatter);

   // Remove all previous paths
   d3.selectAll(".path").remove();

   // Append a path for the total males employment area function
   vis.mTotalPath = vis.svg.append("path").attr("class", "area m-area-total");

   // Append a path for the total males employment area function
   vis.fTotalPath = vis.svg.append("path").attr("class", "area f-area-total");

   // Append a second path for the male remote workers area function
   vis.fRWPath = vis.svg.append("path").attr("class", "area f-area-remote");

   // Append a second path for the male remote workers area function
   vis.mRWPath = vis.svg.append("path").attr("class", "area m-area-remote");

    // call the path to generate the area for total employemnt
    vis.mTotalPath
      .datum(vis.filteredMaleTot)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");

    // call the path to generate the area for total employemnt
    vis.fTotalPath
      .datum(vis.filteredFemaleTot)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");

    // call the path to generate the area for remote workers
    vis.fRWPath
      .datum(vis.filteredFemaleRem)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");

    // call the path to generate the area for remote workers
    vis.mRWPath
      .datum(vis.filteredMaleRem)
      .attr("d", vis.area)
      .attr("clip-path", "url(#clip)");


    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis)
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
    d3.select("#time-period-min-gender").text(vis.dateFormatter(selectionStart));
    d3.select("#time-period-max-gender").text(vis.dateFormatter(selectionEnd));

    // Filter original data depending on selected time period (brush)
    vis.filteredMaleTot = vis.maleTot.filter(function (
      d
    ) {
      return d.month >= selectionStart && d.month <= selectionEnd;
    });

    vis.filteredFemaleTot = vis.femaleTot.filter(function (
      d
    ) {
      return d.month >= selectionStart && d.month <= selectionEnd;
    });

    vis.filteredMaleRem = vis.maleRem.filter(function (
      d
    ) {
      return d.month >= selectionStart && d.month <= selectionEnd;
    });

    vis.filteredFemaleRem = vis.femaleRem.filter(function (
      d
    ) {
      return d.month >= selectionStart && d.month <= selectionEnd;
    });

    vis.wrangleData();
  }
}
