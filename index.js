function converterAndType(value) {
  const type = typeof value;
  if (value === null || type == 'undefined') return [jsonSimpleToHtml, 'null'];
  if (type != 'object') return [jsonSimpleToHtml, type]; // boolean, number, string
  if (Array.isArray(value)) return [jsonArrayToHtml, 'array'];
  return [jsonObjectToHtml, 'object'];
}

function jsonArrayToHtml(array, params) {
  const el = document.createElement('div');

  for (let i = 0; i < array.length; i++) {
    el.appendChild(keyValueToHtml(i, array[i], params));
  }

  el.className = 'json-array ' + (array.length ? 'has-items' : 'is-empty');

  return el;
}

function jsonObjectToHtml(object, params) {
  const el = document.createElement('div');
  const keys = Object.keys(object).sort();

  for (let i = 0; i < keys.length; i++) {
    el.appendChild(keyValueToHtml(keys[i], object[keys[i]], params));
  }

  el.className = 'json-object ' + (keys.length ? 'has-items' : 'is-empty');

  return el;
}

function jsonSimpleToHtml(value, params) {
  const type = params.type || converterAndType(value)[1];
  const el = document.createElement('span');

  el.className = 'json-' + type;
  el.textContent = type == 'null' ? 'null' : type != 'boolean' ? value : value ? 'true' : 'false';

  return el;
}

function jsonToHtml(object, params) {
  const converter = converterAndType(object)[0];
  const humanType = {array: 'Array', object: 'Object'};
  return converter(object, {humanType, ...params});
}

function keyValueToHtml(key, value, params) {
  const [converter, type] = converterAndType(value);
  const itemEl = document.createElement('div');
  const keyEl = document.createElement('span');

  keyEl.className = 'json-key';
  keyEl.textContent = key;
  itemEl.appendChild(keyEl);

  if (converter == jsonSimpleToHtml) {
    const valueEl = converter(value, {...params, type});
    itemEl.className = 'json-item contains-' + type;
    itemEl.appendChild(valueEl);
  }
  else {
    const valueEl = document.createElement('span');
    const len = type == 'array' ? value.length : Object.keys(value).length;
    valueEl.className = 'json-type';

    valueEl.textContent = len
      ? (params.humanType[type] + '[' + len + ']')
      : type == 'array' ? '[]' : '{}';

    itemEl.appendChild(valueEl);
    itemEl.className = 'json-item contains-' + type + ' ' + (len ? 'has-items' : 'is-empty');
    if (len) itemEl.appendChild(converter(value, params));
  }

  return itemEl;
}

module.exports = {jsonToHtml};
