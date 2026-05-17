import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async (context) => {
  // الكود ده هيشتغل على أي إصدار سواء مبعوت locale أو object كامل
  const locale = typeof context === 'string' ? context : (context.locale || 'ar');
  
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});