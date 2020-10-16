var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(journalismData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(journalismData, d => d[chosenXAxis]) * 0.8,
      d3.max(journalismData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Initial Params
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function yScale(journalismData, chosenYAxis) {

  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(journalismData, d => d[chosenYAxis]) * 0.8,
        d3.max(journalismData, d => d[chosenXAxis]) * 1.2
      ])   
      .range([height, 0]);
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale,newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newXScale(d[chosenYAxis]));

  return circlesGroup;
}
// function renderCircles(circlesGroup, ) {

//     circlesGroup.transition()
//       .duration(1000)
      
  
//     return circlesGroup;
//   }



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  var label;
  var label1;

  if ((chosenXAxis === "poverty") && (chosenYAxis === "healthcare")){
    label = "In poverty(%)";
    label1 = "HealthCare(%)";
  }
  else if ((chosenXAxis === "poverty") && (chosenYAxis === "obesity")){
    label = "In poverty(%)";
    label1 = "Obesity(%)";
  }
  else if ((chosenXAxis === "poverty") && (chosenYAxis === "smoke")){
    label = "In poverty(%)";
    label1 = "Smoke(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "healthcare")){
    label = "Age(Median)";
    label1 = "HealthCare(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "obesity")){
    label = "Age(Median)";
    label1 = "Obesity(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "smoke")){
    label = "Age(Median)";
    label1 = "Smoke(%)";
  }
  else if ((chosenXAxis === "income") && (chosenYAxis === "healthcare")){
    label = "Household Income(Median)";
    label1 = "Healthcare(%)";
  }
  else if ((chosenXAxis === "income") && (chosenYAxis === "obesity")){
    label = "Household Income(Median)";
    label1 = "Obesity(%)";
  }
  else {
    label = "Household Income(Median)";
    label1 = "Smoke(%)";
  }
  // if (chosenXAxis === "age") {
  //   label = "Age(Median)";
  // }
  // if (chosenXAxis === "income") {
  //   label = "Household Income(Median)";
  // }
//   else if{
//     label = "# of Albums:";
//   }
// function updateToolTip(chosenYAxis, circlesGroup) {

  // chosenYAxis,
  
  //   if (chosenYAxis === "healthcare") {
  //     label1 = "HealthCare(%)";
  //   }
  //   if (chosenYAxis === "obesity") {
  //     label = "Obesity(%)";
  //   }
  //   if (chosenYAxis === "smoke") {
  //     label1 = "Smoke(%)";
  //   }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br> ${label}:${d[chosenXAxis],${label1} :${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./data.csv").then(function(journalismData, err) {
  if (err) throw err;

  // parse data
  journalismData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity= +data.obesity;
    data.healthcare= +data.obesity
    data.smoke=+data.smoke
  });

  // xLinearScale &yLinearScale function above csv import
  var xLinearScale = xScale(journalismData, chosenXAxis);
  var xLinearScale = xScale(journalismData, chosenXAxis);

  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var xAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(bottomAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(journalismData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.num_hits))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for three x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    // .attr("class","axis-text-x")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");


  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    // .attr("class","axis-text-x")
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");


  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    // .attr("class","axis-text-x")
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");


 // Create group for the three y-axis labels
  
  var ylabelsGroup = chartGroup.append("g");


  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    // .attr("class","axis-text-y")
    .classed("axis-text", true)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lack of Healthcare (%)");


  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-60,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .classed("axis-text", true)
    // .attr("class","axis-text-y")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");


  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", `translate(-80,${height / 2})rotate(-90)`)
    .attr("dy", "1em")
    .classed("axis-text", true)
    // .attr("class","axis-text-y")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity (%)");




  // append y axis
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");

 

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(journalismData, chosenXAxis);
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);


        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        // updates tooltips with new info
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            
        }
        else if (chosenXAxis === "poverty")
         {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          
        }else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);

        }
      }
    })
    .catch(function(error) {
      console.log(error);
  });


    // y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {


     // replaces chosenYAxis with value
      chosenYAxis = value;


      console.log(chosenYAxis)


     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(censusData, chosenXAxis);
     // updates y scale for new data
     yLinearScale = yScale(censusData, chosenYAxis);
     // updates Y axis with transition
     yAxis = renderYAxes(yLinearScale, yAxis);


     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


     textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);


       
     if (chosenYAxis === "healthcare") {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
    
      }
      else if (chosenYAxis === "smokes")
     {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      } else {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", true)
        .classed("inactive", false);   
       }
    }
  });
});





