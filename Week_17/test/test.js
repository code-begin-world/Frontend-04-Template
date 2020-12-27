var assert = require('assert');

import { parseHTML } from '../src/parser/HtmlParser.js';

describe('parse html', function () {
  it('<a></a>', function () {
    var dom = parseHTML('<a></a>');
    assert.equal(dom.children[0].tagName, 'a');
    assert.equal(dom.children[0].children.length, 0);
  });

  var str1 = '<a href="./test.html" title=1 target=\'_blank\'>十大高手桑聚精会神给大家少见多怪</a>';

  it(str1, function () {
    var dom = parseHTML(str1);
    var a = dom.children[0];
    assert.equal(a.tagName, 'a');
    assert.equal(a.attributes.length, 3);
    assert.equal(a.children.length, 1);
  });

  var str2 = '<img />';
  it(str2, function () {
    var dom = parseHTML(str2);
    var img = dom.children[0];
    assert.equal(img.tagName, 'img');
    assert.equal(img.children.length, 0);
  });
  var imgstr = '<img /> ssdsdsd';
  it(imgstr, function () {
    var dom = parseHTML(imgstr);
    var img = dom.children[0];
    assert.equal(img.tagName, 'img');
    assert.equal(img.children.length, 0);
  });

  var str3 = '<input value="1" name=a  readonly disabled/>';
  it(str3, function () {
    var dom = parseHTML(str3);
    var input = dom.children[0];
    assert.equal(input.tagName, 'input');
    assert.equal(input.children.length, 0);
  });
  
  var str4 = '<input  name=a  value="1" readonly disabled/>';
  it(str4, function () {
    var dom = parseHTML(str4);
    var input = dom.children[0];
    assert.equal(input.tagName, 'input');
    assert.equal(input.children.length, 0);
  });
  var str5 = '<button  name=a  value=\'1\' readonly disabled ></button>';
  it(str5, function () {
    var dom = parseHTML(str5);
    var input = dom.children[0];
    assert.equal(input.tagName, 'button');
    assert.equal(input.children.length, 0);
  });

  var str6 = '<button  name=a></button>';
  it(str6, function () {
    var dom = parseHTML(str6);
    var input = dom.children[0];
    assert.equal(input.tagName, 'button');
    assert.equal(input.children.length, 0);
  });

  var str7 = '<input  name=a/>';
  it(str7, function () {
    var dom = parseHTML(str7);
    var input = dom.children[0];
    assert.equal(input.tagName, 'input');
    assert.equal(input.children.length, 0);
  });

  var str8 = '<>';
  it(str8, function () {
    var dom = parseHTML(str8);
    var el = dom.children[0];
    assert.equal(el.type, 'text');
  });

  var str9 = '<input name="name"id="1">';
  it(str9, function () {
    var dom = parseHTML(str9);
    var el = dom.children[0];
    assert.equal(el.tagName, 'input');
  });

  var str10 = '<input name="name" id="1" />';
  it(str10, function () {
    var dom = parseHTML(str10);
    var el = dom.children[0];
    assert.equal(el.tagName, 'input');
  });

  // var str4 = '<input readonly disabled/>';
  // it(str4, function () { 
  //   var dom = parseHTML(str4);
  //   var input = dom.children[0];
  //   assert.equal(input.tagName, 'input');
  //   assert.equal(input.children.length, 0);
  // });
});
