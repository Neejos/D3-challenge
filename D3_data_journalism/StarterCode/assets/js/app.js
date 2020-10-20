function responsivefy(svg) {
  // container will be the DOM element
  // that the svg is appended to
  // we then measure the container
  // and find its aspect ratio
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;
 
  // set viewBox attribute to the initial size
  // control scaling with preserveAspectRatio
  // resize svg on inital page load
  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);
 
  // add a listener so the chart will be resized
  // when the window resizes
  // multiple listeners for the same event type
  // requires a namespace, i.e., 'click.foo'
  // api docs: https://goo.gl/F3ZCFr
  d3.select(window).on(
      'resize.' + container.attr('id'), 
      resize
  );
 
  // this is the code that resizes the chart
  // it will be called on load
  // and in response to window resizes
  // gets the width of the container
  // and resizes the svg to fill it
  // while maintaining a consistent aspect ratio
  function resize() {
      const w = parseInt(container.style('width'));
      svg.attr('width', w);
      svg.attr('height', Math.round(w / aspect));
  }
}








var svgWidth = 1500;
var svgHeight = 1000;

var margin = {
  top: 20,
  right: 10,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// var padding = 1.5;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .call(responsivefy);

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
        d3.max(journalismData, d => d[chosenYAxis]) * 1.2
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
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
// function renderCircles(circlesGroup, ) {

//     circlesGroup.transition()
//       .duration(1000)
      
  
//     return circlesGroup;
//   }
function renderTexts(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]))
  return textGroup;
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {

  // var xlabel="";
  // var ylabel="";

  if ((chosenXAxis === "poverty") && (chosenYAxis === "healthcare")){
    xlabel = "In poverty(%)";
    ylabel = "HealthCare(%)";
  }
  else if ((chosenXAxis === "poverty") && (chosenYAxis === "obesity")){
    xlabel = "In poverty(%)";
    ylabel = "Obesity(%)";
  }
  else if ((chosenXAxis === "poverty") && (chosenYAxis === "smokes")){
    xlabel = "In poverty(%)";
    ylabel = "Smoke(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "healthcare")){
    xlabel = "Age(Median)";
    ylabel = "HealthCare(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "obesity")){
    xlabel = "Age(Median)";
    ylabel = "Obesity(%)";
  }
  else if ((chosenXAxis === "age") && (chosenYAxis === "smokes")){
    xlabel = "Age(Median)";
    ylabel = "Smoke(%)";
  }
  else if ((chosenXAxis === "income") && (chosenYAxis === "healthcare")){
    xlabel = "Household Income(Median)";
    ylabel = "Healthcare(%)";
  }
  else if ((chosenXAxis === "income") && (chosenYAxis === "obesity")){
    xlabel = "Household Income(Median)";
    ylabel = "Obesity(%)";
  }
  else {
    xlabel = "Household Income(Median)";
    ylabel = "Smoke(%)";
  }
  
  console.log(xlabel,ylabel)
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
    return(`${d.state},${d.abbr}<br>${xlabel}:${d[chosenXAxis]}%<br>${ylabel}:${d[chosenYAxis]}%`);
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
// d3.csv(r"C:\Users\neejo\BootcampProjects\D3-challenge\D3_data_journalism\StarterCode\assets\data\data.csv").then(function(journalismData, err) {
  // if (err) throw err;
d3.csv("./assets/data/data.csv").then(function(journalismData) {
  
  console.log(journalismData);
  // parse data
  journalismData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity= +data.obesity;
    data.healthcare= +data.healthcare
    data.smokes=+data.smokes
  });

  // xLinearScale &yLinearScale function above csv import
  var xLinearScale = xScale(journalismData, chosenXAxis);
  var yLinearScale = yScale(journalismData, chosenYAxis);

  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var crlTxtGroup = chartGroup.selectAll("mycircles")
    .data(journalismData)
    .enter()
    .append("g")

  // append initial circles
  var circlesGroup = chartGroup.selectAll("stateCircle")
    .data(journalismData)
    .enter()  
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    // .attr("fill", "pink")
    .attr("opacity", "0.5");

  var textGroup = crlTxtGroup.append("text")
    .text(d=>d.abbr)
    .attr("x", d=>xLinearScale(d[chosenXAxis]))
    .attr("y", d=>yLinearScale(d[chosenYAxis])+3)
    .classed("stateText", true)
    .style("font-size", "7px")
    .style("font-weight", "800")

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    // .attr("class","axis-text-x")
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");


  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    // .attr("class","axis-text-x")
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");


  var incomeLabel = xlabelsGroup.append("text")
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




    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
 

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      
      var value = d3.select(this).attr("value");
      console.log(`${value} click`)
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(journalismData, chosenXAxis);
        // updates y scale for new data
        yLinearScale = yScale(journalismData, chosenYAxis);


        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

       // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

        

         // updates texts with new x values
        textGroup = renderTexts(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

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

        } // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
        // updates texts with new x values
        textGroup = renderTexts(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      }
    })
  //   .catch(function(error) {
  //     console.log(error);
  // });


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
      xLinearScale = xScale(journalismData, chosenXAxis);
     // updates y scale for new data
      yLinearScale = yScale(journalismData, chosenYAxis);
     // updates Y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);


     // updates circles with new y values
     circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

    // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

     textGroup = renderTexts(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);


       
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
    }// updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);
    // updates texts with new x values
    textGroup = renderTexts(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis); 
    
  });
}).catch(function(error) {
  console.log(error);
});





