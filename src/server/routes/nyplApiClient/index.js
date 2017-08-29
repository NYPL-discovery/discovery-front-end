import NyplApiClient from '@nypl/nypl-data-api-client';
import aws from 'aws-sdk';

import config from '../../../../appConfig.js';
import logger from '../../../../logger.js';

const appEnvironment = process.env.APP_ENV || 'production';
const kmsEnvironment = process.env.KMS_ENV || 'encrypted';
const apiBase = config.api[appEnvironment];
let decryptKMS;
let kms;

if (kmsEnvironment === 'encrypted') {
  kms = new aws.KMS({
    region: 'us-east-1',
  });

  decryptKMS = (key) => {
    const params = {
      CiphertextBlob: new Buffer(key, 'base64'),
    };

    return new Promise((resolve, reject) => {
      kms.decrypt(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Plaintext.toString());
        }
      });
    });
  };
}

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

const keys = [clientId, clientSecret];
const CACHE = {};

function client() {
  if (CACHE.nyplApiClient) {
    return Promise.resolve(CACHE.nyplApiClient);
  }

  if (kmsEnvironment === 'encrypted') {
    return new Promise((resolve, reject) => {
      Promise.all(keys.map(decryptKMS))
        .then(([decryptedClientId, decryptedClientSecret]) => {
          const nyplApiClient = new NyplApiClient({
            base_url: apiBase,
            oauth_key: decryptedClientId,
            oauth_secret: decryptedClientSecret,
            oauth_url: config.tokenUrl,
          });

          CACHE.clientId = decryptedClientId;
          CACHE.clientSecret = decryptedClientSecret;
          CACHE.nyplApiClient = nyplApiClient;

          resolve(nyplApiClient);
        })
        .catch(error => {
          logger.error('ERROR trying to decrypt using KMS.', error);
          reject('ERROR trying to decrypt using KMS.', error);
        });
    });
  }

  const nyplApiClient = new NyplApiClient({
    base_url: apiBase,
    oauth_key: clientId,
    oauth_secret: clientSecret,
    oauth_url: config.tokenUrl,
  });

  CACHE.clientId = clientId;
  CACHE.clientSecret = clientSecret;
  CACHE.nyplApiClient = nyplApiClient;

  return Promise.resolve(nyplApiClient);
}

export default client;
