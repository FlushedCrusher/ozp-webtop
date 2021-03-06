'use strict';

/**
 * Various utility functions
 *
 * @module ozp.common.utilities
 */
angular.module('ozp.common.utilities', []);

/**
 * Various utility functions
 *
 * ngtype: factory
 *
 * @namespace ozp.common
 * @class Utilities
 * @constructor
 */
angular.module('ozp.common.utilities').factory('Utilities', function() {

  // TODO: make self-executing?
  var utilities = function() {

    return {
      /**
       * Generate a uuid as per http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
       *
       * @method generateUuid
       * @returns {String} A randomly generated UUID in form 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
       */
      generateUuid: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;  // jshint ignore:line
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16); // jshint ignore:line
        });
        return uuid;
      },
      /**
       * Eliminate duplicate values from an array
       *
       * @method eliminateDuplicates
       * @param {Array} arr An array
       * @returns {Array} Input array with duplicates removed
       */
      eliminateDuplicates: function (arr) {
        var i,
        len=arr.length,
        out=[],
        obj={};

        for (i=0;i<len;i++) {
          obj[arr[i]]=0;
        }
        for (i in obj) {
          out.push(i);
        }
        return out;
      },
      /**
       * Add, update, or remove a query parameter from a url
       * http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
       */
      updateQueryString: function (key, value, url) {
        if (!url) {url = window.location.href;}
        var re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi'),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null) {
              return url.replace(re, '$1' + key + '=' + value + '$2$3');
            }
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                  url += '#' + hash[1];
                }
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null) {
                  url += '#' + hash[1];
                }
                return url;
            }
            else {
              return url;
            }
        }
    }
    };
  };

  return utilities;
});