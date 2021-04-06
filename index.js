let stock = {
  name: "삼성전자",
  symbol:  "005930.KS",
  myQuantity : 200,
  myAvarage: 9000
}

let stocksInfo = await getStockData(stock)
let widget = await createWidget(stock)
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}

Script.complete()

function priceToString(price) {
  return Math.floor(parseFloat(price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function calculate(currentPrice, myAvarage) {
  return ((currentPrice/myAvarage)-1) * 100;
}

async function createWidget(stock) {
  
  let upticker = SFSymbol.named("chevron.up");
  let downticker = SFSymbol.named("chevron.down");
 
  let widget = new ListWidget()
  // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("141414"),
    new Color("13233F")
  ]
  widget.backgroundGradient = gradient

    let row1 = widget.addStack();
    // Add Stock Symbol
    let stockSymbol = row1.addText(stock.name);
    stockSymbol.textColor = Color.white();
    stockSymbol.font = Font.boldMonospacedSystemFont(12);
    //Add Current Price
    row1.addSpacer();
    let symbolPrice = row1.addText(stocksInfo.priceStr);
    symbolPrice.textColor = Color.white();
    symbolPrice.font = Font.boldMonospacedSystemFont(12);
   
    //Second Row
    widget.addSpacer(2)
    let row2= widget.addStack();
    // Add Company name
    let companyName= row2.addText(stocksInfo.name);
    companyName.textColor = Color.white();
    companyName.textOpacity = 0.7;
    companyName.font = Font.boldMonospacedSystemFont(11);
    //Add Today's change in price
    row2.addSpacer();
    let changeValue = row2.addText(priceToString(stocksInfo.changevalue));
    if(stocksInfo.changevalue < 0) {
      changeValue.textColor = Color.red();
    } else {
      changeValue.textColor = Color.green();
    }
    changeValue.font = Font.boldMonospacedSystemFont(11);
    
    // Add Ticker icon
    row2.addSpacer(2);
    let ticker = null;
    if(stocksInfo.changevalue < 0){
      ticker = row2.addImage(downticker.image);
      ticker.tintColor = Color.red();
    } else {
      ticker = row2.addImage(upticker.image);
      ticker.tintColor = Color.green();
    }
       
    ticker.imageSize = new Size(10,10);
    widget.addSpacer(20);
  let myProfit = widget.addText(`￦${priceToString(stock.myQuantity * stocksInfo.price)}`);
  myProfit.textColor = Color.orange();
  myProfit.font = Font.boldMonospacedSystemFont(17);
  widget.addSpacer(8);
  let persentCalcurate = calculate(stocksInfo.price, stock.myAvarage);
  let myProfitPercent =  widget.addText(`${persentCalcurate.toFixed(1)}%`);
  myProfitPercent.textColor = persentCalcurate > 0 ? Color.red() : Color.blue();
  myProfitPercent.font = Font.boldMonospacedSystemFont(13);
  widget.addSpacer(10);
  return widget
}

async function getStockData(stock) { 
    let stkdata = await queryStockData(stock.symbol);
    let price = stkdata.quoteSummary.result[0].price;
    let data = {};
    data.symbol = price.symbol;
    data.changepercent = (price.regularMarketChangePercent.raw * 100).toFixed(2);
    data.changevalue = price.regularMarketChange.raw.toFixed(2);
    data.price = price.regularMarketPrice.raw.toFixed(2);
    data.priceStr = priceToString(data.price);
    data.high = price.regularMarketDayHigh.raw.toFixed(2);
    data.low = price.regularMarketDayLow.raw.toFixed(2);
    data.prevclose = price.regularMarketPreviousClose.raw.toFixed(2);
    data.name = price.shortName;
    return data
}


async function queryStockData(symbol) {
  let url = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" + encodeURIComponent(symbol) + "?modules=price"
  let req = new Request(url)
  return await req.loadJSON()
}