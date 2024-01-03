/* eslint-disable @typescript-eslint/no-unused-vars */
import { Telegram } from 'telegraf';

const sendTelegramMessage = () => {
  try {
    const telegram = new Telegram(
      '6452255074:AAF7i_n41WYPmVZmHMnFK-tniK0ubomCz9Y',
    );
    telegram.sendMessage('-1002106618755', 'Git Commit Done');
  } catch (e) {
    console.log('ee::::>>>>' + e);
  }
};

sendTelegramMessage();
