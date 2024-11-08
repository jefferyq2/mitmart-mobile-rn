'use strict';

import {
  NativeModules
} from 'react-native';

var SimpleAuthWrapper = NativeModules.SimpleAuthWrapper;

/**
 * @class SimpleAuthClient
 *
 * Configure and authorize with various social API's.
 * Including: Google, Twitter, Facebook, Instagram, Tumblr & LinkedIn.
 */
class SimpleAuthClient {

  /**
   * Helper to configure the SimpleAuthWrapper for a given provider and config.
   * @param {string} provider
   * @param {Object} config
   * @returns {Promise}
   * @private
   */
  _configure(provider, config) {
    return new Promise(function (resolve) {
      SimpleAuthWrapper.configure(provider, config, resolve);
    });
  }

  /**
   * Configure the SimpleAuth client.
   *
   * You can either pass in a single provider and corresponding config or an
   * object provider id's as keys and configs as values.
   *
   * ### Usage:
   * #### Single provider:
   *
   * ```javascript
   *
   * let simpleAuthClient = new SimpleAuthClient();
   *
   * simpleAuthClient.configure('twitter', {
   *   consumer_key: 'KEY',
   *   consumer_secret: 'SECRET'
   * }).then(() => {
   *   // Twitter is configured.
   * })```
   *
   * #### Multiple providers:
   *
   * ```javascript
   * simpleAuthClient.configure({
   *   twitter: {
   *     consumer_key: 'KEY',
   *     consumer_secret: 'SECRET'
   *   },
   *   facebook: {
   *     app_id: 'ID'
   *   }
   * }).then(() => {
   *   // Twitter & Facebook are configured.
   * });```
   *
   * You must do this and wait for the promise to resolve before you can
   * call authorize.
   *
   * @param {string|Object} provider Provider id (eg. 'twitter', 'facebook')
   * @param {Object} config
   * @returns {Promise}
   */
  configure(provider, config) {
    // Expect provider, config if > 1 argument.
    if (arguments.length > 1) {
      return this._configure(provider, config);
    } else {
      config = arguments[0];
      console.log(config);
      return Promise.all(Object.keys(config).map(provider => {
        return this._configure(provider, config[provider]);
      }));
    }
  }

  authorize(provider) {
    return new Promise((resolve, reject) => {
      SimpleAuthWrapper.authorize(provider, function (error, credentials, info) {
        if (error) {
          reject(error);
        } else {
          info.token = credentials.token;
          info.credentials = credentials;
          resolve(info)
        }
      });
    });
  }

}

module.exports = new SimpleAuthClient();
