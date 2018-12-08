/*!
 * Library for pretty printing JSON to html tables
 * Copyright (c) 2018 Carlos Castro Martos
 * Released under the MIT license
 * Date: 2018-11-16
 */
let prettyJSON = (function () {
  "use strict";

  let version = '1.0.0';

  /**
   * Validates if an object is empty
   * @method _isEmpty
   * @private
   * @param {Object} an object
   * @return {boolean} true if object is empty
   */
  function _isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * Validates if an object is an array
   * @method _isArray
   * @private
   * @param {Object} an object
   * @return {boolean} true if object is an array
   */
  function _isArray(obj) {
    return !!obj && obj.constructor === Array;
  }

  /**
   * Build an html string with nested tables representing the JSON object
   * @method htmlTable
   * @param {Object} a JSON object
   * @return {string} an html string with nested tables
   */
  function htmlTable(obj) {

    let str = '';
    let res = 0;

    try {
      res = JSON.parse(JSON.stringify(obj));
      str += '<div class="table-responsive"><table class="table table-striped table-bordered">';
      //console.log(res);
      for (obj in res) {
        let value = res[obj];
        str += '<tr>'
       // console.log(typeof value);
        //is null or object or  array or plain string or number
        if (value == null) {
          str += '<td class="table-primary">' + obj + '</td>' + '<td>null</td>';
          //is string
        } else if (typeof value == 'string') {
          str += '<td class="table-primary">' + obj + ' (<i>string</i>)</td><td>' + value + '</td>';
          //is number
        } else if (typeof value == 'number') {
          str += '<td class="table-primary">' + obj + ' (<i>number</i>)</td><td>' + value + '</td>';
          //is object
        } else if (typeof value == 'object' && !_isArray(value)) {

          str += '<td class="table-primary">' + obj + ' (<i>object{}</i>)</td>';

          //if object is empty do not iterate
          if (_isEmpty(value)) {
            str += '<td><i>(empty)</i></td>';
          } else {
            str += '<td>' + _iterate(value) + '</td>';
          }
          //is array 
        } else if (typeof value == 'object' && _isArray(value)) {

          str += '<td class="table-primary">' + obj + ' (<i>Array[]</i>)</td>';
          //if length 0 do not iterate
          if (value.length == 0) {
            str += '<td><i>(empty)</i></td>';
          } else {
            str += '<td>' + _iterate(value) + '</td>';
          }

        } else {
          str += '<td>unknown</td><td>none</td>';
        }

        str += '</tr>';
      }
      str += '</table></div>';
    } catch (e) {
      console.log('Error' + e);
    }
    return str;
  }

  /**
   * Build an html table string iterating an object
   * @method _iterate
   * @private
   * @param {Object} an object
   * @return {string} an HTML table string
   */
  function _iterate(unobj) {
    let str = '<table class="table table-striped table-bordered">';
   // console.log(unobj);
    let item;
    for (item in unobj) {
      let value = unobj[item];
     // console.log(typeof value);
      if (value == null) {
        str += '<tr><td class="table-primary">' + item + '</td><td>null</td></tr>';
      } else if (typeof value == 'object') {
        if (_isArray(value)) {
          str += '<tr><td class="table-primary">' + item + ' (<i>Array[]</i>)</td>';
        } else {
          str += '<tr><td class="table-primary">' + item + ' (<i>object{}</i>)</td>';
        }

        //if object is empty or array has 0 elem print do not iterate
        if (_isEmpty(value)) {
          str += '<td><i>(empty)</i></td></tr>';
        } else if (_isArray(value) && value.length == 0) {
          str += '<td><i>(0 elem)</i></td></tr>';
        } else {
          str += '<td>' + _iterate(value) + '</td></tr>';
        }

      } else { //is not object
        //si es un string
        if (typeof value === 'string') {
          str += '<tr><td class="table-primary">' + item + ' (<i>String</i>)</td>';
        } else if (typeof value === 'number') {
          str += '<tr><td class="table-primary">' + item + ' (<i>number</i>)</td>';
        } else {
          str += '<tr><td class="table-primary">' + item + '</td>';
        }
        str += '<td>' + value + '</td></tr>';
      }
    }

    str += '</table>';
    return str;
  }

  return {
    htmlTable: htmlTable
  }

})();