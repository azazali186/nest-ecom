/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { Telegram } = require('telegraf');

const sendTelegramMessage = (msg) => {
  try {
    const names = ['Ali Azaz', 'Saif'];
    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex];

    msg = 'BackEnd API update \n' + msg + '\nUpdated By ' + randomName;
    const telegram = new Telegram(
      '6880685900:AAGbuYNIdve9LEnBSAqez4s3wBajJ-vTxBQ',
    );
    telegram.sendMessage('-4038243150', msg);
  } catch (e) {
    console.log('ee::::>>>>' + e);
  }
};

const commitMessageArg = "updated role and permission management and configuration";

sendTelegramMessage(commitMessageArg);
