//data
let currencyData;


function LoadData() {
    
    fetch("resourses/data/CurrencyData.json").then(function(response){    
        return response.json();
    }).then(function(currencyData){
        // call was a success so call
        ShowOptions(currencyData)
        return true;
    }).catch(function(error){
        // call failed
        console.log(`Error - ${error}`);
        return false;
    });

    
}




var DropDownMenuOption1;
var DropDownMenuOption2;


//identifies each currency type and add them on load
function ShowOptions(data){
    //parses the data into objects
    currencyData = data;
    DropDownMenuOption1 = document.getElementById("CurrencyOption1");
    DropDownMenuOption2 = document.getElementById("CurrencyOption2");
    
    var optionToAddTo1;
    var optionToAddTo2;

    if (DropDownMenuOption1.length <= Object.keys(currencyData).length ) {

        let currencyTypes = [];
        for (let i = 0; i < Object.keys(currencyData).length; i++) {
            currencyTypes[i] = currencyData[Object.keys(currencyData)[i]];
            optionToAddTo1 = document.createElement("option");
            optionToAddTo1.text = currencyTypes[i].name;
            optionToAddTo2 = document.createElement("option");
            optionToAddTo1.value = i;
            optionToAddTo2.value = i;
            optionToAddTo2.text = currencyTypes[i].name;
            DropDownMenuOption1.add(optionToAddTo1);
            DropDownMenuOption2.add(optionToAddTo2);
        }
    }

    DropDownMenuOption1.value = 0
    DropDownMenuOption2.value = 1
    
}
    


//calculates the conversion of cash 
function CalculateConversion(event){
    //prevents submit button event
    event.preventDefault();
    //get amount to convert
    let amountToConvert = document.getElementById("CurrencyAmount").value;


    //sets total conversion and conversion rate using json currencyData
    let inverseRateSource = currencyData[Object.keys(currencyData)[DropDownMenuOption1.value]].inverseRate;
    let conversionRateDestination = currencyData[Object.keys(currencyData)[DropDownMenuOption2.value]].rate;
    let destinationCurrency = amountToConvert * inverseRateSource * conversionRateDestination;
    let exchangeRate = inverseRateSource * conversionRateDestination;
    destinationCurrency = destinationCurrency.toFixed(2)
    

    //sets text output
    document.getElementById("output").innerText = "Current Exchange Rate: 1.00 " +  currencyData[Object.keys(currencyData)[DropDownMenuOption1.value]].code + " = " + exchangeRate.toFixed(5) + " " + currencyData[Object.keys(currencyData)[DropDownMenuOption2.value]].code + "\n"
    + "Calculation Timestamp: " + currencyData[Object.keys(currencyData)[DropDownMenuOption1.value]].date + "\n" + 
    "Amount of transaction: " + destinationCurrency + " " + currencyData[Object.keys(currencyData)[DropDownMenuOption2.value]].code; 
}

addEventListener('submit', CalculateConversion);


