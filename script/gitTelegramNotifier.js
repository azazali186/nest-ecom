/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { Telegram } = require('telegraf');

const sendTelegramMessage = (msg) => {
  try {
    const telegram = new Telegram(
      '6452255074:AAF7i_n41WYPmVZmHMnFK-tniK0ubomCz9Y',
    );
    telegram.sendMessage('-1002106618755', msg);
  } catch (e) {
    console.log('ee::::>>>>' + e);
  }
};

const commitMessageArg = process.argv[2];

sendTelegramMessage(commitMessageArg);
