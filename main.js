//NOTES
/** 
 * Javascript has async functions here. 
 * This means that console logs may print stuff out of order 
 * depending on which async function recieves their data first.
 * Obviously, code that is synchronous will console log first
 * 
*/


//IMPORTS
require('dotenv').config();
const dateFns = require('date-fns');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const { formatToTimeZone } = require('date-fns-timezone');


//GLOBAL VARS
const format = `yyyy-MM-dd`; 

//MAIN SECTION 

//Open or Closed
const alpaca = new Alpaca({
    keyId: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    paper: true,
    usePolygon: false
})

alpaca.getClock()
    .then((clock) => {
        console.log(`The market is ${clock.is_open ? 'open.' : 'closed.'}`)
})

//Date and Timezone
const today = new Date();
const date = dateFns.format(today, format);
alpaca.getCalendar({
    start: date,
    end: date
}).then((calendars) => {
    console.log(calendars)
})

const timeZone = 'America/Toronto';
const edtFormat = 'YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)';
const edtDate = formatToTimeZone(new Date(), edtFormat, { timeZone });
console.log(edtDate);

//Data Retrieval
const to = dateFns.format(today, format)
today.setMonth(today.getMonth() - 3)
const from = dateFns.format(today, format)
const stock = 'AAPL' 

alpaca
    .getAggregates(
        stock,
        'day',
        from,
        to
    )
    .then(data => {
        console.table(data.results)
    }).catch((e) => {
        console.log(e)
    })

