let dateParser2 = d3.timeParse("%-m/%-d/%Y");

let ageBracketsEmployed2 = [
    "16-19 Total",
    "20-24 Total",
    "25-34 Total",
    "35-44 Total",
    "45-54 Total",
    "55-64 Total",
    "65+ Total",
];

let ageBracketsRW2 = [
    "16-19 RW",
    "20-24 RW",
    "25-34 RW",
    "35-44 RW",
    "45-54 RW",
    "55-64 RW",
    "65+ RW",
];

let dates2 = [
    "5/1/2020",
    "6/1/2020",
    "7/1/2020",
    "8/1/2020",
    "9/1/2020",
    "10/1/2020",
    "11/1/2020",
    "12/1/2020",
    "1/1/2021",
    "2/1/2021",
    "3/1/2021",
    "4/1/2021",
    "5/1/2021",
    "6/1/2021",
    "7/1/2021",
    "8/1/2021",
    "9/1/2021",
    "10/1/2021",
    "11/1/2021",
    "12/1/2021",
    "1/1/2022",
    "2/1/2022",
    "3/1/2022",
    "4/1/2022",
    "5/1/2022",
    "6/1/2022",
    "7/1/2022",
    "8/1/2022",
    "9/1/2022",
];

let raceRW = [
    "White RW",
    "Black or African American RW",
    "Asian RW",
    "Hispanic or Latino RW"
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
    "Less Than High School Diploma RW",
    "High School Graduate, No College RW",
    "Some College or Associate Degree RW",
    "Bachelor's Degree Only RW",
    "Advanced Degree RW"
];

class beehive {

    constructor(parentElement, data){
        this.parentElement = parentElement;
        this.dataset = data;

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

        this.initVis()
    }

    initVis(){

        this.wrangleData();
    }

    wrangleData(){
        let vis = this

        let masterData = this.dataset

        // People Working Remotely - Education Data
        // ===============================
        // create an array to hold the info for each gender
        vis.eduData = [];

        // loop over the dates from the data
        dates.forEach(function (date) {

            // get the values for each gender from the master data
            let lessHS = masterData.find((d) => d[""] === "Less Than High School Diploma RW")[date];
            let hsOnly = masterData.find((d) => d[""] === "High School Graduate, No College RW")[date];
            let associateD = masterData.find((d) => d[""] === "Some College or Associate Degree RW")[date];
            let bachelorsD = masterData.find((d) => d[""] === "Bachelor's Degree Only RW")[date];
            let advancedD = masterData.find((d) => d[""] === "Advanced Degree RW")[date];

            // add object to the gender arrays
            vis.eduData.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the total for each month
                lessHS: lessHS,
                hs: hsOnly,
                associate: associateD,
                bachelors: bachelorsD,
                advanced: advancedD,
            });
        });

        // People Working Remotely - Gender Data
        // ===============================
        // create an array to hold the info for each gender
        vis.maleTotalEmp = [];
        vis.femaleTotalEmp = [];
        vis.maleRemote = [];
        vis.femaleRemote = [];

        // loop over the dates from the data
        dates.forEach(function (date) {

            // get the values for each gender from the master data
            let maleunder25_RW = masterData.find((d) => d[""] === "M16-25 RW")[date];
            let male25_54_RW = masterData.find((d) => d[""] === "M25-54 RW")[date];
            let male55up_RW = masterData.find((d) => d[""] === "M55+ RW")[date];
            let femaleunder25_RW = masterData.find((d) => d[""] === "W16-25 RW")[date];
            let female25_54_RW = masterData.find((d) => d[""] === "W25-54 RW")[date];
            let female55up_RW = masterData.find((d) => d[""] === "W55+ RW")[date];
            let maleunder25_Total = masterData.find((d) => d[""] === "M16-25 Total")[date];
            let male25_54_Total = masterData.find((d) => d[""] === "M25-54 Total")[date];
            let male55up_Total = masterData.find((d) => d[""] === "M55+ Total")[date];
            let femaleunder25_Total = masterData.find((d) => d[""] === "W16-25 Total")[date];
            let female25_54_Total = masterData.find((d) => d[""] === "W25-54 Total")[date];
            let female55up_Total = masterData.find((d) => d[""] === "W55+ Total")[date];
            let maleRW = maleunder25_RW + male25_54_RW + male55up_RW;
            let maleTotal = maleunder25_Total + male25_54_Total + male55up_Total;
            let femaleRW = femaleunder25_RW + female25_54_RW + female55up_RW;
            let femaleTotal = femaleunder25_Total + female25_54_Total + female55up_Total;

            // add object to the gender arrays
            vis.maleTotalEmp.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the total for each month
                total: maleTotal,
            });
            // add object to the gender arrays
            vis.femaleTotalEmp.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the total for each month
                total: femaleTotal,
            });
            // add object to the gender arrays
            vis.maleRemote.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the total for each month
                total: maleRW,
            });
            // add object to the gender arrays
            vis.femaleRemote.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the total for each month
                total: femaleRW,
            });
        });

        // Calculate proportion of each race working remotely
        // ===============================
        // create an array to hold the proportion info for each race group
        vis.raceGroupProportions = [];

        // loop over the dates from the data
        dates.forEach(function (date) {

            // get the total and remote work values for each race group from the master data
            let total_Asian = masterData.find((d) => d[""] === "Asian Total")[date];
            let total_White = masterData.find((d) => d[""] === "White Total")[date];
            let total_Black = masterData.find((d) => d[""] === "Black or African American Total")[date];
            let total_Hispanic = masterData.find((d) => d[""] === "Hispanic or Latino Total")[date];
            let remote_Asian = masterData.find((d) => d[""] === "Asian RW")[date];
            let remote_White = masterData.find((d) => d[""] === "White RW")[date];
            let remote_Black = masterData.find((d) => d[""] === "Black or African American RW")[date];
            let remote_Hispanic = masterData.find((d) => d[""] === "Hispanic or Latino RW")[date];

            // add an object to the proportions array
            vis.raceGroupProportions.push({
                // parse the date string for each month
                month: dateParser(date),

                // store the proportion of remote workers for each month by race group
                Asian: (remote_Asian / total_Asian) * 100,
                White: (remote_White / total_White) * 100,
                Black: (remote_Black / total_Black) * 100,
                Hispanic: (remote_Hispanic / total_Hispanic) * 100,
            });
        });

        // Total Number of People Employed
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        vis.ageBracketsEmployedTotals2 = [];

        // loop over the dates from the data
        dates2.forEach(function (date) {
            // set the counter to 0
            let monthTotal = 0;

            // for each ageBracket in the array
            ageBracketsEmployed2.forEach(function (bracket) {
                // the first column key is an empty string; if we rename it, we'll need to change this
                // find the number in the bracket for that date and increment the total
                monthTotal += masterData.find((d) => d[""] === bracket)[date];
            });

            // add an object to the (employed) array
            vis.ageBracketsEmployedTotals2.push({
                // parse the date string for each month
                month: dateParser2(date),
                // store the total for each month
                total: monthTotal,
            });
        });

        // console.log(ageBracketsEmployedTotals);

        // Total Number of People Working Remotely
        // ===============================
        // create an (RW) array to hold the info for each age bracket
        vis.ageBracketsRWTotals2 = [];

        // loop over the dates from the data
        dates2.forEach(function (date) {
            // set the counter to 0
            let monthTotal = 0;

            // for each ageBracket in the array
            ageBracketsRW2.forEach(function (bracket) {
                // the first column key is an empty string; if we rename it, we'll need to change this
                // find the number in the bracket for that date and increment the total
                monthTotal += masterData.find((d) => d[""] === bracket)[date];
            });

            // get the values for each age brakcet from the master data
            let total_RW_16_19 = masterData.find((d) => d[""] === "16-19 RW")[date];
            let total_RW_20_24 = masterData.find((d) => d[""] === "20-24 RW")[date];
            let total_RW_25_34 = masterData.find((d) => d[""] === "25-34 RW")[date];
            let total_RW_35_44 = masterData.find((d) => d[""] === "35-44 RW")[date];
            let total_RW_45_54 = masterData.find((d) => d[""] === "45-54 RW")[date];
            let total_RW_55_64 = masterData.find((d) => d[""] === "55-64 RW")[date];
            let total_RW_65_UP = masterData.find((d) => d[""] === "65+ RW")[date];

            // add an object to the (RW) array
            vis.ageBracketsRWTotals2.push({
                // parse the date string for each month
                month: dateParser2(date),
                // store the total for each month
                total: monthTotal,

                // store the total for each month by age bracket
                total_RW_16_19: total_RW_16_19,
                total_RW_20_24: total_RW_20_24,
                total_RW_25_34: total_RW_25_34,
                total_RW_35_44: total_RW_35_44,
                total_RW_45_54: total_RW_45_54,
                total_RW_55_64: total_RW_55_64,
                total_RW_65_UP: total_RW_65_UP,
            });
        });

        // Data by Age Group
        // ===============================
        // create an (employed) array to hold the info for each age bracket
        let byAgeBracketsRW = [];

        // for each ageBracket in the array, calculate their totals
        ageBracketsRW.forEach(function (bracket) {

            let bracketTotal = 0;
            let day = masterData.find((d) => d[""] === bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byAgeBracketsRW.push({
                // store name of bracket
                Name: bracket,
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
            let day = masterData.find((d) => d[""] === bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byRaceRW.push({
                // store name of bracket
                Name: bracket,
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
            let day = masterData.find((d) => d[""] === bracket)
            delete day[""];
            for (const key in day) {
                bracketTotal += day[key];
            }

            // add an object to array
            byEducationRW.push({
                // store name of bracket
                Name: bracket,
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
            .attr("fill", d => d.children ? vis.color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

        const label = vis.svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.data.Name + (d.children ? "" : ": " + vis.format(d.data.distribution)));

        vis.svg
            .on("click", (event) => zoom(event, root));


        zoomTo([root.x, root.y, root.r * 2]);

        function zoomTo(v) {
            const k = vis.width / v[2];

            view = v;

            label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
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

            label
                .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }

        return vis.svg.node();
    }
}