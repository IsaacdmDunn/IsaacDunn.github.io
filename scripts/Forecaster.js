let fuelJSONData;
let fuelData=[];
var options;
let visibleLines=[true,true,true,true];
var chart;
var data;

function drawChart() {
    //sets data
    data = google.visualization.arrayToDataTable(fuelData);
        //sets options
        options = {  
        series: {
            0: { color: '#FF0000' },
            1: { color: '#00FF00' },
            2: { color: '#0000FF' },
            3: { color: '#FF00FF' },
        },      
    };
        
    //draw chart
    chart = new google.visualization.LineChart(document.getElementById('myChart'));
    chart.draw(data, options);

}

//starts on load to load in data
function LoadData() {
    //load chart packages 
    google.charts.load('current',{packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    //fetch file
    fetch("resourses/data/FuelData.json").then(function(response){    
        return response.json();
    }).then(function(fuelJSONData){
        //if successfil set data to chart
        SetDataToChart(fuelJSONData);
        return true;
        //if not successful show erroe
    }).catch(function(error){
        // call failed
        console.log(`Error - ${error}`);
        return false;
    });

    
}

//sets data from the last 12 months to graph
function SetDataToChart(data){
    fuelJSONData = data;
    console.log(fuelJSONData);
    fuelData[0] = ["X", "Solid", "Gas", "Electricity", "Liquid"];
    for (let i = 2; i < 12; i++) {
        fuelData[i-1]=[fuelJSONData[Object.keys(fuelJSONData).length-12+i][0] + " " + //year
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][1],  //month
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][2], //solid
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][3], //gas
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][4], //electricity
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][5]]; //liquid
    }
    drawChart();
}

//updates the chart based on date selected
function UpdateDate(){
    //gets the max allowed date on the date input to use to count back months
    let maxDate = document.getElementById("dateInput").getAttribute("max"); 
    
    
    let input = document.getElementById("dateInput").value;
    let year = input.substring(0,4);
    let maxYear = maxDate.substring(0,4);
    let month = input.substring(5,7);
    let maxMonth = maxDate.substring(5,7);

    let dateOffset=((maxYear-year)*12); //sets data id for the year selected from the date input 
    dateOffset-=(month-maxMonth); //set data id for the month selected from the date input
    if(dateOffset < 12) dateOffset=12;//last 12 months

    //sets date using the date offset 
    fuelData[0] = ["X", "Solid", "Gas", "Electricity", "Liquid"];
    for (let i = -1; i < 12; i++) {
        fuelData[i+2]=[fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][0] + " " + //year
        fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][1],  //month
        fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][2], //solid
        fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][3], //gas
        fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][4], //electricity
        fuelJSONData[Object.keys(fuelJSONData).length-dateOffset+i][5]]; //liquid
        console.log(fuelData[i+1]);
        
    }
    drawChart();
}

//toggles liquid line
function ToggleLiquid(){
    visibleLines[3]=!visibleLines[3];
    RenderLines();
}
//toggles electric line
function ToggleElectric(){
    visibleLines[2]=!visibleLines[2];
    RenderLines();
}

//toggles gas line
function ToggleGas(){
    visibleLines[1]=!visibleLines[1];
    RenderLines();
}

//toggles solid line
function ToggleSolid(){
    visibleLines[0]=!visibleLines[0];
    RenderLines();
}

//updates which lines on the graph needs to be visible
function RenderLines(){
    view = new google.visualization.DataView(data);
    if(!visibleLines[0])
    {
        view.hideColumns([1]);
    }
    if(!visibleLines[1])
    {
        view.hideColumns([2]);
    }
    if(!visibleLines[2])
    {
        view.hideColumns([3]);
    }
    if(!visibleLines[3])
    {
        view.hideColumns([4]);
    }
    chart.draw(view, options);
}

//toggles between historical and forecast mode using radio buttons
function ToggleHistoricalToForecastMode(){
    
    if(document.querySelector('input[name = "DataMode"]:checked').value == "Historical"){
        LoadData();
        document.getElementById("dateInput").disabled = false;//make date disables while in forecast mode

    }
    else{
        ForeCastData();
        document.getElementById("dateInput").disabled = true; //date allowed in historical mode

    }
}

//forcast mode
function ForeCastData(){

    var forecastData=[];
    
    let gasPreviousYear=[];
    let solidPreviousYear=[];
    let electricPreviousYear=[];
    let liquidPreviousYear=[];
    let gasForecastRate;
    let solidForecastRate;
    let liquidForecastRate;
    let electricForecastRate;
    let year;
    
    forecastData[0]= ["X", "Solid", "Gas", "Electricity", "Liquid"]
    
    //gets all prices from last year
    for(i=-1; i<12; i++){
        solidPreviousYear[i+1] = fuelJSONData[Object.keys(fuelJSONData).length-12+i][2];//solid
        gasPreviousYear[i+1] = fuelJSONData[Object.keys(fuelJSONData).length-12+i][3];//gas
        electricPreviousYear[i+1] = fuelJSONData[Object.keys(fuelJSONData).length-12+i][4];//electric
        liquidPreviousYear[i+1] = fuelJSONData[Object.keys(fuelJSONData).length-12+i][5];//liquid
    }

    //finds decimal percentage of price change between each fuel type
    solidForecastRate=forcastAlgorithm(solidPreviousYear);
    gasForecastRate=forcastAlgorithm(gasPreviousYear);
    electricForecastRate=forcastAlgorithm(electricPreviousYear);
    liquidForecastRate=forcastAlgorithm(liquidPreviousYear);

    //sets for casted data for next 12 months
    for (let i = -1; i < 12; i++) {
        year = fuelJSONData[Object.keys(fuelJSONData).length-12+i][0]+1;
        forecastData[i+2]=[year + " " + //year
        fuelJSONData[Object.keys(fuelJSONData).length-12+i][1],  //month
        (solidPreviousYear[i+1]+(solidPreviousYear[i+1]*solidForecastRate)), //solid
        (gasPreviousYear[i+1]+(gasPreviousYear[i+1]*gasForecastRate)), //gas
        (electricPreviousYear[i+1]+(electricPreviousYear[i+1]*electricForecastRate)), //electricity
        (liquidPreviousYear[i+1]+(liquidPreviousYear[i+1]*liquidForecastRate))]; //liquid
       
    }

    //sets data table for graph
    data = google.visualization.arrayToDataTable(forecastData);
    //sets line colours
    options = {
        series: {
          0: { color: '#FF0000' },
          1: { color: '#00FF00' },
          2: { color: '#0000FF' },
          3: { color: '#FF00FF' },
        },
      };
      
    //draw chart
    chart = new google.visualization.LineChart(document.getElementById('myChart'));
    chart.draw(data, options);
    
}

//returns decimal percentage increase from lowest to highest numbers in array
function forcastAlgorithm(array){
    let highest = Math.max(...array);
    let lowest = Math.min(...array);
    return (highest-lowest)/lowest;
}