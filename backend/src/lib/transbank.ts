import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from 'transbank-sdk';

const isProduction = process.env.TRANSBANK_ENVIRONMENT === 'production';

export const webpayTransaction = new WebpayPlus.Transaction(
  new Options(
    isProduction
      ? process.env.TRANSBANK_COMMERCE_CODE!
      : IntegrationCommerceCodes.WEBPAY_PLUS,
    isProduction ? process.env.TRANSBANK_API_KEY! : IntegrationApiKeys.WEBPAY,
    isProduction ? Environment.Production : Environment.Integration,
  ),
);
