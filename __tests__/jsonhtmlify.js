require('browser-env')({url: 'http://localhost'});

const {jsonhtmlify} = require('../index');

let complexEl;
beforeAll(() => {
  complexEl = jsonhtmlify({
    arr0: [],
    arr6: [42, 0, false, true, 'foo', {k0: 'some value'}],
    bool0: false,
    obj0: {},
    obj1: {null: null},
    str0: '',
    str1: 'hello world',
  });
});

test('export ', () => {
  expect(typeof jsonhtmlify).toBe('function');
});

test('simple boolean ', () => {
  const jsonEl = jsonhtmlify(true);
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-item contains-boolean');

  const childEl = jsonEl.querySelector('.json-boolean');
  expect(childEl.childNodes.length).toBe(1);
  expect(childEl.className).toBe('json-boolean');
  expect(childEl.textContent).toBe('true');
});

test('simple number', () => {
  const jsonEl = jsonhtmlify(42);
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-item contains-number');

  const childEl = jsonEl.querySelector('.json-number');
  expect(childEl.childNodes.length).toBe(1);
  expect(childEl.className).toBe('json-number');
  expect(childEl.textContent).toBe('42');
});

test('simple string', () => {
  const jsonEl = jsonhtmlify('foo');
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-item contains-string');

  const childEl = jsonEl.querySelector('.json-string');
  expect(childEl.childNodes.length).toBe(1);
  expect(childEl.className).toBe('json-string');
  expect(childEl.textContent).toBe('foo');
});

test('simple null', () => {
  const jsonEl = jsonhtmlify(null);
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-item contains-null');

  const childEl = jsonEl.querySelector('.json-null');
  expect(childEl.childNodes.length).toBe(1);
  expect(childEl.className).toBe('json-null');
  expect(childEl.textContent).toBe('null');
});

test('simple undefined', () => {
  const jsonEl = jsonhtmlify(undefined);
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-item contains-null');

  const childEl = jsonEl.querySelector('.json-null');
  expect(childEl.childNodes.length).toBe(1);
  expect(childEl.className).toBe('json-null');
  expect(childEl.textContent).toBe('null');
});

test('empty array', () => {
  const jsonEl = jsonhtmlify([]).childNodes[1];
  expect(jsonEl.childNodes.length).toBe(0);
  expect(jsonEl.className).toBe('json-array is-empty');
  expect(jsonEl.textContent).toBe('');
});

test('empty object', () => {
  const jsonEl = jsonhtmlify({}).childNodes[1];
  expect(jsonEl.childNodes.length).toBe(0);
  expect(jsonEl.className).toBe('json-object is-empty');
  expect(jsonEl.textContent).toBe('');
});

test('simple object', () => {
  const jsonEl = jsonhtmlify({bool0: false}).childNodes[1];
  expect(jsonEl.childNodes.length).toBe(1);
  expect(jsonEl.className).toBe('json-object has-items');
  expect(jsonEl.textContent).toBe('bool0false');
});

test('complex object', () => {
  expect(complexEl.className).toBe('json-item contains-object has-items');
  expect(complexEl.childNodes.length).toBe(2);
  expect(complexEl.childNodes[0].className).toBe('json-type');
  expect(complexEl.childNodes[1].className).toBe('json-object has-items');
  expect(complexEl.childNodes[1].childNodes.length).toBe(7);
  expect(complexEl.childNodes[1].className).toBe('json-object has-items');
});

test('complex object children', () => {
  const childNodes = complexEl.childNodes[1].childNodes;
  expect(childNodes[0].className).toBe('json-item contains-array is-empty');
  expect(childNodes[1].className).toBe('json-item contains-array has-items');
  expect(childNodes[2].className).toBe('json-item contains-boolean');
  expect(childNodes[3].className).toBe('json-item contains-object is-empty');
  expect(childNodes[4].className).toBe('json-item contains-object has-items');
  expect(childNodes[5].className).toBe('json-item contains-string');
  expect(childNodes[6].className).toBe('json-item contains-string');
});

test('complex object array', () => {
  const sel = '.json-item.contains-array.has-items';
  const arrayEls = complexEl.querySelector(sel).childNodes;
  expect(arrayEls[0].className).toBe('json-key');
  expect(arrayEls[0].textContent).toBe('arr6');
  expect(arrayEls[1].className).toBe('json-type');
  expect(arrayEls[1].textContent).toBe('array[6]');
  expect(arrayEls[2].className).toBe('json-array has-items');
});

test('complex object array object', () => {
  let sel = [
    '.json-item.contains-array.has-items',
    '.json-array.has-items',
    '.json-item.contains-object.has-items',
  ];

  const objEls = complexEl.querySelector(sel.join(' > ')).childNodes;
  expect(objEls).toBeTruthy();
  expect(objEls[0].className).toBe('json-key');
  expect(objEls[0].textContent).toBe('5');
  expect(objEls[1].className).toBe('json-type');
  expect(objEls[1].textContent).toBe('object[1]');
  expect(objEls[2].className).toBe('json-object has-items');

  sel = '.json-item.contains-string .json-string';
  expect(objEls[2].querySelector(sel).textContent).toBe('some value');
})

test('complex object null', () => {
  const strEl = complexEl.childNodes[1].childNodes[5];
  expect(strEl.querySelector('.json-key').textContent).toBe('str0');
  expect(strEl.querySelector('.json-string').textContent).toBe('');
  //expect(complexEl.innerHTML.split('><').join('>\n<')).toBe('');
});
