const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// provided by twillio 
const msgFrom = 'whatsapp:+xxxxxxxxxxx';
// your Whatsapp Phone Nr
const msgTo = 'whatsapp:+4478xxxxxxxx';
//Target site
const vgmUrl= 'https://www.currys.co.uk/gbuk/search-keywords/xx_xx_xx_xx_xx/rtx%2B3080/xx-criteria.html';
//Desired products
const cardList = /#product10214421|product10214446|product10214425|product10214882|product10214434|product10214426|product10214430|product10216248|product10215051|product10216731|product10216247|product10219296|product10218689|product10219298|product10214421/g
//how many times the script has ran
let n = 0;
// retry every x minutes
const retryTime = 1 

function watch(){ 
  (async function checkSite() {
    const response = await got(vgmUrl);
    const dom = new JSDOM(response.body);
    let cards = [...dom.window.document.querySelectorAll("article")].filter(p=>p.id.match(cardList));

    cards.forEach(card => {  
      if (card.querySelector('[data-availability="homeDeliveryAvailable"]')) { 
        let href = card.querySelector('a').href;
        return whatsApp(href) ,console.log(href) 
      }
    }) 
    
    n++
    console.log("Try nr:", n)
    
  })();
  setTimeout(watch, 60000*retryTime);
}

const whatsApp = (href) => {
  require('dotenv').config();
  var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
  var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
  const client = require('twilio')(accountSid,authToken,{ lazyLoading: true });

  client.messages.create({
    from: msgFrom,
    body: href,
    to: msgTo
  }).then(message => console.log(message.sid)).catch(e=>console.log(e));

}


watch()
