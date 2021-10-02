var elevatorAmountCalculated = false
var valueOfRadio
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
var totalShafts
function isEmpty(str) {
    return !str.trim().length;
}
var selection
function selectChanged(){
    elevatorAmountCalculated = false
    var inputClasses = document.getElementsByClassName('input')
    inputClasses.hidden = true
    document.getElementsByName("elevator-amount")[0].value = 0
    selection = document.getElementById('building-type').value
    for(var i = 0 ; i < inputClasses.length; i++){
        inputClasses[i].setAttribute("hidden", "true")
    }
    if(selection == "residential"){
        document.getElementById('number-of-floors').removeAttribute('hidden')
        document.getElementById('number-of-apartments').removeAttribute("hidden")
        document.getElementById('number-of-basements')  .removeAttribute("hidden")
        
    }
    else if (selection == "commercial"){
        document.getElementById('number-of-floors').removeAttribute('hidden')
        document.getElementById('number-of-basements').removeAttribute('hidden')
        document.getElementById('number-of-companies').removeAttribute('hidden')
        document.getElementById('number-of-parking-spots').removeAttribute('hidden')
        document.getElementById('number-of-elevators').removeAttribute('hidden')

    }
    else if (selection == "corporate"){
        document.getElementById('number-of-floors').removeAttribute('hidden')
        document.getElementById('number-of-basements').removeAttribute('hidden')
        document.getElementById('number-of-parking-spots').removeAttribute('hidden')
        document.getElementById('number-of-corporations').removeAttribute('hidden')
        document.getElementById('maximum-occupancy').removeAttribute('hidden')
    }
    else if (selection == "hybrid"){
        document.getElementById('number-of-floors').removeAttribute('hidden')
        document.getElementById('number-of-basements').removeAttribute('hidden')
        document.getElementById('number-of-companies').removeAttribute('hidden')
        document.getElementById('number-of-parking-spots').removeAttribute('hidden')
        document.getElementById('maximum-occupancy').removeAttribute('hidden')
        document.getElementById('business-hours').removeAttribute('hidden')
    }
}
async function calculateElevators(radio){
    document.getElementById("price-calculation").setAttribute("hidden", "true")
    elevatorAmountCalculated = false
    selection = document.getElementById('building-type').value
    if(selection == "commercial" && document.getElementsByName("number-of-elevators")[0].value > 0){
        var resNode = await fetch(`/calculateElevator?cages=${parseInt( document.getElementsByName("number-of-elevators")[0].value)}&type=${selection}`);
        var resultNode = await resNode.json()
        console.log(resultNode.result)
        document.getElementsByName("elevator-amount")[0].value = resultNode.result
        elevatorAmountCalculated = true
    }
    else if(selection == "residential" && document.getElementsByName("number-of-apartments")[0].value > 0 && document.getElementsByName("number-of-floors")[0].value > 0){
        var resNode = await fetch(`/calculateElevator?apartment=${parseInt(document.getElementsByName("number-of-apartments")[0].value)}&floor=${parseInt(document.getElementsByName("number-of-floors")[0].value)}&type=${selection}`);
        var resultNode = await resNode.json()
        document.getElementsByName("elevator-amount")[0].value = resultNode.result
        elevatorAmountCalculated = true
    }
    else if (selection == "corporate" || selection == "hybrid"){
        if(document.getElementsByName("number-of-floors")[0].value > 0 && document.getElementsByName("number-of-basements")[0].value > 0 && document.getElementsByName("maximum-occupancy")[0].value >0 ) {
            var resNode = await fetch(`/calculateElevator?floor=${parseInt(document.getElementsByName("number-of-floors")[0].value)}&basement=${parseInt(document.getElementsByName("number-of-basements")[0].value)}&occupancy=${parseInt(document.getElementsByName("maximum-occupancy")[0].value)}&type=${selection}`);
            var resultNode = await resNode.json()

            document.getElementsByName("elevator-amount")[0].value = resultNode.result
            elevatorAmountCalculated = true
        }
    }
    if(elevatorAmountCalculated == true && document.getElementsByName("elevator-amount")[0].value != 0){
        document.getElementById("price-calculation").removeAttribute("hidden")
        if(valueOfRadio != undefined){
            calculatePrices()
            
        }
    }
    
    
}

function radioButtonClicked(radio){
    if(radio.value == "standard"){
        valueOfRadio = "standard"
        document.getElementsByName("elevator-unit-price")[0].value = formatter.format("7565")
    }
    else if(radio.value == "premium"){
        valueOfRadio = "premium"
        document.getElementsByName("elevator-unit-price")[0].value = formatter.format("12345")
    }
    else{
        valueOfRadio = "excelium"
        document.getElementsByName("elevator-unit-price")[0].value = formatter.format("15400")
    }
    console.log(elevatorAmountCalculated)
    if(elevatorAmountCalculated == true && document.getElementsByName("elevator-amount")[0].value != 0){
        calculatePrices()
    }
}
async function calculatePrices(){
    var resNode = await fetch(`/productInfo?productInfo=${valueOfRadio}`);
    var resultNode = await resNode.json()
    var unitPrice = resultNode.unitPrice
    var installationFeesRate = resultNode.installationFeesRate
    var resNode = await fetch(`/calculatePrices?totalElevators=${document.getElementsByName("elevator-amount")[0].value}&unitPrice=${unitPrice}&installationFeesRate=${installationFeesRate}`);
    var resultNode = await resNode.json()
    document.getElementsByName("final-price")[0].value = formatter.format(resultNode.finalPrice)
    document.getElementsByName("installation-fees")[0].value = formatter.format(resultNode.installationFees)
    document.getElementsByName("elevator-total-price")[0].value = formatter.format(resultNode.totalElevatorsPrice)
}


