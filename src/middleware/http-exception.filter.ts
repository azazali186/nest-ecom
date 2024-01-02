import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import logger from 'src/utils/logger';
import { ApiResponse } from 'src/utils/response.util';
import { LangService } from 'src/services/lang.service';
import { Telegram } from 'telegraf';
import { bold, code, join, underline } from 'telegraf/format';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: LangService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<any>();
    const status = exception.getStatus();
    logger.error(exception.getResponse());

    if (process.env.TG_LOG === 'true')
      try {
        const telegram = new Telegram(process.env.TG_BOT_TOKEN as string);
        const message = join([
          bold(underline(exception.name)),
          code(exception.stack?.replaceAll(exception.name, '')),
        ]);
        telegram
          .sendMessage(process.env.TG_CHAT_ID, message)
          .then((r) => console.log('rr::::>>>>' + r));
      } catch (e) {
        console.log('ee::::>>>>' + e);
      }

    const lang = req.headers?.lang?.toLowerCase() || 'en';

    let errorResponse: any; // Define a variable to store the error response

    if (typeof exception.getResponse() === 'object') {
      errorResponse = exception.getResponse();
    } else {
      errorResponse = { error: exception.getResponse() as string };
    }
    const data = new Set(errorResponse.message.toString().split(','));
    const translatedMessage = [];
    data.forEach((d) => {
      const msg = this.i18n.getErrorTranslation(`${d}`, {
        lang,
        args: { data: errorResponse.param },
      });
      if (msg.includes('error.')) {
        translatedMessage.push(d);
      } else {
        translatedMessage.push(msg);
      }
    });
    const res = await ApiResponse.error(status, translatedMessage);
    response.status(status).json(res);
  }
}
