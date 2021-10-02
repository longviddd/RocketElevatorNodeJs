let PORT = process.env.PORT || 5000;
var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/quote.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'quote.html'))
})
app.get('/residential.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'residential.html'))
})
app.get('/commercial.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'commercial.html'))
})
app.post('',(req,res)=>{
    
})

app.listen(PORT, (res) => {
    console.log("SERVER STARTED AT PORT 3000")
})

app.get('/productInfo', (req, res) => {
    let unitPrice
    let installationFeesRate
    if (req.query.productInfo == 'standard') {
        unitPrice = 7565
        installationFeesRate = 0.1
    } else if (req.query.productInfo == 'premium') {
        unitPrice = 12345
        installationFeesRate = 0.13
    } else if (req.query.productInfo == 'excelium') {
        unitPrice = 15400
        installationFeesRate = 0.16
    } else {
        unitPrice = 0
        installationFeesRate = 0
    };

    res.json({ unitPrice: unitPrice, installationFeesRate: installationFeesRate })
})
app.get('/calculateElevator', (req, res) => {
    let totalElevatorsShafts
    if (req.query.type === 'residential') {
        var { apartment, floor } = req.query
        let shafts = Math.ceil(apartment / (floor * 6))
        let columns = Math.ceil(floor / 20)
        totalElevatorsShafts = shafts * columns
    };

    if (req.query.type == 'commercial') {
        totalElevatorsShafts = req.query.cages
    };

    if (req.query.type == 'corporate' || req.query.type == 'hybrid') {
        var { floor, basement, occupancy } = req.query
        let totalFloors = parseInt(floor) + parseInt(basement)
        let totalOccupants = occupancy * floor
        let shafts = Math.ceil(totalOccupants / 1000)
        let columns = Math.ceil(totalFloors / 20)
        let shaftsPerColumn = Math.ceil(shafts / columns)
        totalElevatorsShafts = shaftsPerColumn * columns
    };

    res.json({ result: totalElevatorsShafts })
});
app.get('/calculatePrices', (req, res) => {
    var { totalElevators, unitPrice, installationFeesRate } = req.query
    var totalElevatorsPrice = totalElevators * unitPrice
    var installationFees = totalElevatorsPrice * installationFeesRate
    finalPrice = parseFloat(totalElevatorsPrice) + parseFloat(installationFees)
    res.json({ finalPrice: finalPrice, totalElevatorsPrice: totalElevatorsPrice, installationFees: installationFees })
});
