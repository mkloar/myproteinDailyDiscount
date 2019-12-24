const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// read data from .env
dotenv.config({path: __dirname + '/.env'});


let userMail = process.env.userMail;
let userPass = process.env.userPass;


if (userMail === undefined || userPass === undefined) {
  console.log("Please add userMail and userPass to .env");
  return;
}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
         user: userMail,
         pass: userPass
     }
});

const mailOptions = {
  from: userMail, // sender address
  to: userMail, // list of receivers
  subject: 'Myprotein discount', // Subject line
  html: ''// plain text body
};


const getDiscountCode = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const discountDiv = await page.$(".stripBanner");

    const discountHTML = await page.evaluate(body => body.innerText, discountDiv);

    await browser.close();
    return discountHTML;
  } catch (error) {
    return error;
  }
}

let myproteinSites = [
  "http://www.myprotein.com",
  "https://si.myprotein.com"
];

const executeScrapingAndSendMail = async (myproteinSites) => {
  let data = "";
  let isError = false;
  for(let i = 0; i < myproteinSites.length; i++) {
    let siteUrl = myproteinSites[i];

    data += await getDiscountCode(siteUrl).then(result => {
      console.log(`Succesfully exported data from ${siteUrl}`);
      return `<h3>Site: ${siteUrl} </h3><br>
      <p>Discount: ${result}</p><br>`;
    }).catch(err => {
      console.log(`Error: ${err.message}`);
      isError = true;
    });
  }
  
  // send mail if data exists
  if(data.length > 0 && !isError) {
    mailOptions.html = data;

    // send mail
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)  {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}

executeScrapingAndSendMail(myproteinSites);
