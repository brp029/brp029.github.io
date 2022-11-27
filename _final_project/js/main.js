// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%-m/%-d/%Y");
// https://github.com/d3/d3-time-format
let dateParser = d3.timeParse("%-m/%-d/%Y");

let ageBracketsEmployed = [
  "16-19 Total",
  "20-24 Total",
  "25-34 Total",
  "35-44 Total",
  "45-54 Total",
  "55-64 Total",
  "65+ Total",
];

let ageBracketsRW = [
  "16-19 RW",
  "20-24 RW",
  "25-34 RW",
  "35-44 RW",
  "45-54 RW",
  "55-64 RW",
  "65+ RW",
];

let dates = [
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

let raceGroupsEmployed = [
  "Asian Total",
  "White Total",
  "Black or African American Total",
  "Hispanic or Latino Total",
];

let raceGroupsRW = [
  "Asian RW",
  "White RW",
  "Black or African American RW",
  "Hispanic or Latino RW",
];

// Load data with promises
let promises = [
  d3.csv("data/COVID-19-Database-Clean.csv", (d) => {
    dates.forEach(function (date) {
      // parseInt doesn't like the commas in the database
      // so we remove the commas before converting the strings to numbers
      d[date] = parseInt(String(d[date]).replaceAll(",", ""));
    });

    return d;
  }),
];

Promise.all(promises)
  .then(function (data) {
    createVis(data);
  })
  .catch(function (err) {
    console.log(err);
  });

function createVis(data) {
  let masterData = data[0];

  console.log("master data", masterData);

  // Total Number of People Employed
  // ===============================
  // create an (employed) array to hold the info for each age bracket
  let ageBracketsEmployedTotals = [];

  // loop over the dates from the data
  dates.forEach(function (date) {
    // set the counter to 0
    let monthTotal = 0;

    // for each ageBracket in the array
    ageBracketsEmployed.forEach(function (bracket) {
      // the first column key is an empty string; if we rename it, we'll need to change this
      // find the number in the bracket for that date and increment the total
      monthTotal += masterData.find((d) => d[""] === bracket)[date];
    });

    // add an object to the (employed) array
    ageBracketsEmployedTotals.push({
      // parse the date string for each month
      month: dateParser(date),
      // store the total for each month
      total: monthTotal,
    });
  });

  console.log("ageBracketsTotals",ageBracketsEmployedTotals);

  // Total Number of People Working Remotely
  // ===============================
  // create an (RW) array to hold the info for each age bracket
  let ageBracketsRWTotals = [];

  // loop over the dates from the data
  dates.forEach(function (date) {
    // set the counter to 0
    let monthTotal = 0;

    // for each ageBracket in the array
    ageBracketsRW.forEach(function (bracket) {
      // the first column key is an empty string; if we rename it, we'll need to change this
      // find the number in the bracket for that date and increment the total
      monthTotal += masterData.find((d) => d[""] === bracket)[date];
    });

    // get the values for each age bracket from the master data
    let total_RW_16_24;
    let total_RW_16_19 = masterData.find((d) => d[""] === "16-19 RW")[date];
    let total_RW_20_24 = masterData.find((d) => d[""] === "20-24 RW")[date];
    let total_RW_25_34 = masterData.find((d) => d[""] === "25-34 RW")[date];
    let total_RW_35_44 = masterData.find((d) => d[""] === "35-44 RW")[date];
    let total_RW_45_54 = masterData.find((d) => d[""] === "45-54 RW")[date];
    let total_RW_55_64 = masterData.find((d) => d[""] === "55-64 RW")[date];
    let total_RW_65_UP = masterData.find((d) => d[""] === "65+ RW")[date];

    // add an object to the (RW) array
    ageBracketsRWTotals.push({
      // parse the date string for each month
      month: dateParser(date),
      // store the total for each month
      total: monthTotal,

      // store the total for each month by age bracket
      total_RW_16_24: total_RW_16_19 + total_RW_20_24,
      total_RW_16_19: total_RW_16_19,
      total_RW_20_24: total_RW_20_24,
      total_RW_25_34: total_RW_25_34,
      total_RW_35_44: total_RW_35_44,
      total_RW_45_54: total_RW_45_54,
      total_RW_55_64: total_RW_55_64,
      total_RW_65_UP: total_RW_65_UP,
    });
  });

  console.log("ageBracketsRWTotals", ageBracketsRWTotals);

  // Calculate proportion of each race working remotely
  // ===============================
  // create an array to hold the proportion info for each race group
  let raceGroupProportions = [];

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
    raceGroupProportions.push({
      // parse the date string for each month
      month: dateParser(date),

      // store the proportion of remote workers for each month by race group
      Asian: (remote_Asian / total_Asian) * 100,
      White: (remote_White / total_White) * 100,
      Black: (remote_Black / total_Black) * 100,
      Hispanic: (remote_Hispanic / total_Hispanic) * 100,
    });
  });

  console.log("raceGroupProportions", raceGroupProportions);

  // Create event handler
  let eventHandler = {
    bind: (eventName, handler) => {
      document.body.addEventListener(eventName, handler);
    },
    trigger: (eventName, extraParameters) => {
      document.body.dispatchEvent(
        new CustomEvent(eventName, {
          detail: extraParameters,
        })
      );
    },
  };

  // People Working Remotely - Gender Data
  // ===============================
  // create an array to hold the info for each gender
  maleTotalEmp = [];
  femaleTotalEmp = [];
  maleRemote = [];
  femaleRemote = [];

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
    maleTotalEmp.push({
      // parse the date string for each month
      month: dateParser(date),

      // store the total for each month
      total: maleTotal,
    });
    // add object to the gender arrays
    femaleTotalEmp.push({
      // parse the date string for each month
      month: dateParser(date),

      // store the total for each month
      total: femaleTotal,
    });
    // add object to the gender arrays
    maleRemote.push({
      // parse the date string for each month
      month: dateParser(date),

      // store the total for each month
      total: maleRW,
    });
    // add object to the gender arrays
    femaleRemote.push({
      // parse the date string for each month
      month: dateParser(date),

      // store the total for each month
      total: femaleRW,
    });
  });

  console.log("genderTotals", maleTotalEmp);

  // People Working Remotely - Education Data
  // ===============================
  // create an array to hold the info for each gender
  eduData = [];

  // loop over the dates from the data
  dates.forEach(function (date) {

    // get the values for each gender from the master data
    let lessHS = masterData.find((d) => d[""] === "Less Than High School Diploma RW")[date];
    let hsOnly = masterData.find((d) => d[""] === "High School Graduate, No College RW")[date];
    let associateD = masterData.find((d) => d[""] === "Some College or Associate Degree RW")[date];
    let bachelorsD = masterData.find((d) => d[""] === "Bachelor's Degree Only RW")[date];
    let advancedD = masterData.find((d) => d[""] === "Advanced Degree RW")[date];

    // add object to the gender arrays
    eduData.push({
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

  console.log("edu", eduData);

  // Create visualization instance for totals area chart
  let totalsVis = new TotalsVis(
    "totals-vis",
    ageBracketsEmployedTotals,
    ageBracketsRWTotals,
    eventHandler
  );

  let beehiveVis = new beehive("beehive", masterData);

  // Bind event handler
  // when 'selectionChanged' is triggered, specified function is called
  eventHandler.bind("selectionChanged", function (event) {
    let rangeStart = event.detail[0];
    let rangeEnd = event.detail[1];

    // log the start and end dates from the brush
    console.log("range START", rangeStart);
    console.log("range END", rangeEnd);
  });

  // Create visualization instance for gender area chart
  let genderVis = new GenderVis("gender-vis", maleTotalEmp, femaleTotalEmp, maleRemote, femaleRemote);

  // Create visualization instance for age brackets line chart
  let ageVis = new AgeVis("age-vis", ageBracketsRWTotals);

  // Create visualization instance for education stacked bar chart
  let eduVis = new EduVis("edu-vis", eduData, ageBracketsRWTotals);

  // Create visualization instance for race grouped bar chart chart
  let raceVis = new RaceVis("race-vis", raceGroupProportions);
}
