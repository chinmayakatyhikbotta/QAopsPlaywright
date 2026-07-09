require('dotenv').config();

function optional(name, defaultValue = undefined) {
  return process.env[name] || defaultValue;
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and set your credentials.`
    );
  }
  return value;
}

function hasCredentials(emailKey, passwordKey) {
  return Boolean(process.env[emailKey] && process.env[passwordKey]);
}

exports.hasClientAppCredentials = () =>
  hasCredentials('CLIENT_APP_EMAIL', 'CLIENT_APP_PASSWORD');

exports.hasEventHubCredentials = () =>
  hasCredentials('EVENTHUB_EMAIL', 'EVENTHUB_PASSWORD');

exports.getClientAppCredentials = () => ({
  userEmail: required('CLIENT_APP_EMAIL'),
  userPassword: required('CLIENT_APP_PASSWORD'),
});

exports.getClientAppLoginPayload = () => {
  const { userEmail, userPassword } = exports.getClientAppCredentials();
  return { userEmail, userPassword };
};

exports.getOrderPayload = () => ({
  orders: [
    {
      country: optional('ORDER_COUNTRY', 'India'),
      productOrderedId: required('PRODUCT_ORDERED_ID'),
    },
  ],
});

exports.getDefaultProductName = () =>
  optional('ORDER_PRODUCT_NAME', 'ZARA COAT 3');

exports.getEventHubCredentials = () => ({
  email: required('EVENTHUB_EMAIL'),
  password: required('EVENTHUB_PASSWORD'),
});

exports.getEventHubBaseUrl = () =>
  optional('EVENTHUB_BASE_URL', 'https://eventhub.rahulshettyacademy.com');
