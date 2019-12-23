# myproteinDailyDiscount
Get myprotein discount on a mail every day. This repository create cron job.

# Prerequirements

- Nodejs
- Puppeteer
- Nodemailer
- Dotenv
- Linux

# How to user

1. npm install
2. create .env file
3. add userMail=... and userPass=... into .env
4. run `crontab -e` inside terminal
5. add `* 9 * * * node pathToScrape.js file > /dev/null 2>$1` (get email every day at 9am, it's up to you)
