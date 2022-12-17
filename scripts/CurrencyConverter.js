//data
let currencyData='{"usd":{"code":"USD","alphaCode":"USD","numericCode":"840","name":"U.S. Dollar","rate":1.1203575246881,"date":"Sun, 16 Oct 2022 11:55:01 GMT","inverseRate":0.89257221731818},"eur":{"code":"EUR","alphaCode":"EUR","numericCode":"978","name":"Euro","rate":1.1513036031045,"date":"Sun, 16 Oct 2022 11:55:01 GMT","inverseRate":0.86858062226461},"cad":{"code":"CAD","alphaCode":"CAD","numericCode":"124","name":"Canadian Dollar","rate":1.5467527665941,"date":"Sun, 16 Oct 2022 11:55:01 GMT","inverseRate":0.64651573386352},"jpy":{"code":"JPY","alphaCode":"JPY","numericCode":"392","name":"Japanese Yen","rate":165.44668135014,"date":"Sun, 16 Oct 2022 11:55:01 GMT","inverseRate":0.0060442433286629}}'


// async function getData(file) {
//     let jsonFile = await fetch(file, {mode: 'no-cors'})
    
//     .then(function(currencyData) {
//         console.log(currencyData); 
//         currencyData=jsonFile;
//       }).catch(function(error) {  
//         console.log('Request failed', error)  
//       });
//   }
//getData("CurrencyData.json");
console.log(currencyData);
//parses the data into objects
const obj = JSON.parse(currencyData);

var DropDownMenuOption1;
var DropDownMenuOption2;



//identifies each currency type and add them on load
function ShowOptions(){
    DropDownMenuOption1 = document.getElementById("CurrencyOption1");
    DropDownMenuOption2 = document.getElementById("CurrencyOption2");
    
    var optionToAddTo1;
    var optionToAddTo2;
    if (DropDownMenuOption1.length <= Object.keys(obj).length ) {

        let currencyTypes = [];
        for (let i = 0; i < Object.keys(obj).length; i++) {
            currencyTypes[i] = obj[Object.keys(obj)[i]];
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


    //sets total conversion and conversion rate using json data
    let inverseRateSource = obj[Object.keys(obj)[DropDownMenuOption1.value]].inverseRate;
    let conversionRateDestination = obj[Object.keys(obj)[DropDownMenuOption2.value]].rate;
    let destinationCurrency = amountToConvert * inverseRateSource * conversionRateDestination;
    let exchangeRate = inverseRateSource * conversionRateDestination;
    destinationCurrency = destinationCurrency.toFixed(2)
    

    //sets text output
    document.getElementById("output").innerText = "Current Exchange Rate: 1.00 " +  obj[Object.keys(obj)[DropDownMenuOption1.value]].code + " = " + exchangeRate.toFixed(5) + " " + obj[Object.keys(obj)[DropDownMenuOption2.value]].code + "\n"
    + "Calculation Timestamp: " + obj[Object.keys(obj)[DropDownMenuOption1.value]].date + "\n" + 
    "Amount of transaction: " + destinationCurrency + " " + obj[Object.keys(obj)[DropDownMenuOption2.value]].code; 
}

addEventListener('submit', CalculateConversion);


