const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODEER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
