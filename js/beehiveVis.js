let ageBracketsRW2 = [
    {"bracket": "16-19 RW", "bracket_new": "16-19"},
    {"bracket": "20-24 RW", "bracket_new": "20-24"},
    {"bracket": "25-34 RW", "bracket_new": "25-34"},
    {"bracket": "35-44 RW", "bracket_new": "35-44"},
    {"bracket": "45-54 RW", "bracket_new": "45-54"},
    {"bracket": "55-64 RW", "bracket_new": "55-64"},
    {"bracket": "65+ RW", "bracket_new": "65+"}
];
let raceRW = [
    {"bracket": "White RW", "bracket_new":"White"},
    {"bracket": "Black or African American RW", "bracket_new": "Black"},
    {"bracket": "Asian RW", "bracket_new": "Asian"},
    {"bracket": "Hispanic or Latino RW", "bracket_new": "Hispanic"}
];

let genderRW = [
    "M16-25 RW",
    "M25-54 RW",
    "M55+ RW",
    "W16-25 RW",
    "W25-54 RW",
    "W55+ RW"
];

let educationRW = [
    {"bracket": "Less Than High School Diploma RW", "bracket_new": "No High School Diploma"},
    {"bracket": "High School Graduate, No College RW", "bracket_new": "High School Diploma"},
    {"bracket": "Some College or Associate Degree RW", "bracket_new": "Some College/Associate Degree"},
    {"bracket": "Bachelor's Degree Only RW", "bracket_new": "Bachelor's Degree"},
    {"bracket": "Advanced Degree RW", "bracket_new": "Advanced Degree"}
];

class beehive {

    constructor(parentElement, data){
        this.parentElement = parentElement;
        this.dataset = data;

        this.initVis()
    }

    initVis(){

        let vis = this;
        vis.width = 600
        vis.height = 600
        vis.format = d3.format(",.2%");

        vis.color = d3.scaleOrdinal()
            .domain(["race", "age", "gender", "education"])
            .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970"]);

        vis.pack = data => d3.pack()
            .size([vis.width, vis.height])
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.distribution)
                .sort((a, b) => b.value - a.value))

        vis.svg = d3.select("#" + this.parentElement)
            .append("svg")
            .attr("viewBox", `-${vis.width / 2} -${vis.height / 2} ${vis.width+200} ${vis.height}`)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("cursor", "pointer")

        vis.tooltip = d3.select("#" + this.parentElement)
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("padding", "5px")
            .text("Click to learn more!");

        this.wrangleData();
    }

    wrangleData(){
        let vis = this

        let masterData = this.dataset

        // Data by Age Group
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        let byAgeBracketsRW = [];

        // for each ageBracket in the array, calculate their totals
        ageBracketsRW2.forEach(function (bracket) {

            let bracketTotal = 0;
            let day = masterData.find((d) => d[""] === bracket.bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byAgeBracketsRW.push({
                // store name of bracket
                Name: bracket.bracket_new,
                // store the total for each month
                Total: bracketTotal,
                // store category
                category: "age"
            });
        });
        // add all age groups together to get total
        let ageTotal = 0
        for (let i = 0; i < byAgeBracketsRW.length; i++) {
            ageTotal += byAgeBracketsRW[i]["Total"];
        }
        // add distribution to object
        byAgeBracketsRW = byAgeBracketsRW.map(v => ({...v, distribution: v["Total"] / ageTotal}))

        console.log("byAgeBracketsRW", byAgeBracketsRW);

        // Data by Race
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        let byRaceRW = [];

        // loop over the dates from the data

        // for each ageBracket in the array, calculate their totals
        raceRW.forEach(function (bracket) {

            let bracketTotal = 0;
            let day = masterData.find((d) => d[""] === bracket.bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byRaceRW.push({
                // store name of bracket
                Name: bracket.bracket_new,
                // store the total for each month
                Total: bracketTotal,
                // store category
                category: "race"
            });
        });
        // add all race groups together to get total
        let raceTotal = 0
        for (let i = 0; i < byRaceRW.length; i++) {
            raceTotal += byRaceRW[i]["Total"];
        }
        // add distribution to object
        byRaceRW = byRaceRW.map(v => ({...v, distribution: v["Total"] / raceTotal}))

        console.log("byRaceRW", byRaceRW);

        // Data by Gender
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        let byGenderRW = [];

        // loop over the dates from the data

        // get total males by added together the 3 male brackets
        let maleTotal = 0
        for (let i = 0; i < 3; i++) {
            let bracket = masterData.find((d) => d[""] === genderRW[i])
            delete bracket[""];
            for (const key in bracket) {
                maleTotal += bracket[key];
            }
        }

        // get total females by added together the 3 male brackets
        let femaleTotal = 0
        for (let i = 3; i < 6; i++) {
            let bracket = masterData.find((d) => d[""] === genderRW[i])
            delete bracket[""];
            for (const key in bracket) {
                femaleTotal += bracket[key];
            }
        }

        // add maleTotal to byGenderRW array
        byGenderRW.push({
            // store name of bracket
            Name: "Male",
            // store the total for each month
            Total: maleTotal,
            // store category
            category: "gender",
            // store distribution
            distribution: maleTotal / (maleTotal + femaleTotal)
        });

        // add femaleTotal to byGenderRW array
        byGenderRW.push({
            // store name of bracket
            Name: "Female",
            // store the total for each month
            Total: femaleTotal,
            // store category
            category: "gender",
            // store distribution
            distribution: femaleTotal / (maleTotal + femaleTotal)
        });

        console.log("byGenderRW", byGenderRW)

        // Data by Education
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        let byEducationRW = [];

        // loop over the dates from the data

        // for each ageBracket in the array, calculate their totals
        educationRW.forEach(function (bracket) {

            let bracketTotal = 0;
            let day = masterData.find((d) => d[""] === bracket.bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byEducationRW.push({
                // store name of bracket
                Name: bracket.bracket_new,
                // store the total for each month
                Total: bracketTotal,
                // store category
                category: "education"
            });
        });
        // add all education groups together to get total
        let educationTotal = 0
        for (let i = 0; i < byEducationRW.length; i++) {
            educationTotal += byEducationRW[i]["Total"];
        }
        // add distribution to object
        byEducationRW = byEducationRW.map(v => ({...v, distribution: v["Total"] / educationTotal}))

        console.log("byEducationRW", byEducationRW);

        // create final dataset for beehive
        vis.beehiveData = {
            "Name": "Demographics",
            "children":[
                {"Name": "Race", "children": byRaceRW},
                {"Name": "Gender", "children": byGenderRW},
                {"Name": "Education", "children": byEducationRW},
                {"Name": "Age", "children": byAgeBracketsRW}
            ]
        }

        console.log("beehiveData", vis.beehiveData)

        vis.updateVis()
    }

    updateVis(){

        let vis = this

        const root = vis.pack(vis.beehiveData);
        let focus = root;
        let view;

        const node = vis.svg.append("g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("id", "circletooltip")
            .attr("fill", d => d.children ? vis.color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

        vis.label = vis.svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.data.Name + (d.children ? "" : ": " + vis.format(d.data.distribution)))
            .attr("dy", d => d.data.Name === "No High School Diploma" ? "-1em" : "0em")
            .attr("font-size", d => d.children ? "20px" : "15px")
            .attr("font-weight", "bold");

        vis.svg
            .on("click", (event) => zoom(event, root));


        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
            const k = vis.width / v[2];

            view = v;

            vis.label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(event, d) {
            const focus0 = focus;

            focus = d;

            const transition = vis.svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            vis.label
                .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        return vis.svg.node();
    }
}