import { Currency } from 'src/entities/currency.entity';
import { Language } from 'src/entities/language.entity';

export const createLanguageData = () => {
  const data = [
    {
      name: 'English',
      code: 'en',
    },
    {
      name: 'Chinese',
      code: 'zh',
    },
    {
      name: 'Khmer',
      code: 'km',
    },
    {
      name: 'Hindi',
      code: 'hn',
    },
  ];

  data.map(async (ln) => {
    const l = await Language.findOne({
      where: {
        code: ln.code,
      },
    });
    if (!l) {
      const newL = new Language();
      newL.name = ln.name;
      newL.code = ln.code;
      await newL.save();
    }
  });
};

export const createCurrencyData = () => {
  const data = [
    {
      name: 'US Dollar',
      code: 'USD',
      symbol: '$',
    },
    {
      name: 'Cambodian Riyal',
      code: 'KHR',
      symbol: '៛',
    },
    {
      name: 'Indian Rupee',
      code: 'INR',
      symbol: '₹',
    },
  ];

  data.map(async (cu) => {
    const oC = await Currency.findOne({
      where: {
        code: cu.code,
      },
    });
    if (!oC) {
      const c = new Currency();
      c.name = cu.name;
      c.code = cu.code;
      c.symbol = cu.symbol;
      await c.save();
    }
  });
};
