require('browser-env')({url: 'http://localhost'});

const {jsonhtmlify} = require('../index');

test('visited ', () => {
  const json = {foo: 42, array: []};
  json.array.push(json);
  json.self = json;

  const jsonEl = jsonhtmlify(json);
  expect(jsonEl.className).toBe('json-item contains-object has-items has-recursive-items');
  expect(jsonEl.childNodes.length).toBe(2);

  const seenEls = jsonEl.querySelectorAll('.is-seen');
  expect(seenEls[0].className).toBe('json-item contains-object has-items is-seen');
  expect(seenEls[1].className).toBe('json-object has-items is-seen');
  expect(seenEls[1].childNodes.length).toBe(0);
  expect(seenEls[2].className).toBe('json-item contains-object has-items is-seen');
  expect(seenEls[3].className).toBe('json-object has-items is-seen');
  expect(seenEls[3].childNodes.length).toBe(0);
});
