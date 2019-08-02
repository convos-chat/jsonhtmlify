function jsonToHtml(json) {
  let rootEl = document.createElement('div');
  const queue = [[json, rootEl]];

  while (queue.length) {
    const [topic, parentEl] = queue.shift();
    let topicEl, keyByIndex;

    // Figure out the type we are working with
    let type = typeof topic; // boolean, number, string, ...
    if (topic === null || type == 'undefined') {
      type = 'null';
    }
    else if (Array.isArray(topic)) {
      type = 'array';
    }

    // Convert topic to a DOM node
    if (type == 'array') {
      keyByIndex = (i) => i;
      keyByIndex.len = topic.length;
      topicEl = document.createElement('div');
      topicEl.className = 'json-array ' + (keyByIndex.len ? 'has-items' : 'is-empty');
    }
    else if (type == 'object') {
      const keys = Object.keys(topic).sort();
      keyByIndex = (i) => keys[i];
      keyByIndex.len = keys.length;
      topicEl = document.createElement('div');
      topicEl.className = 'json-object ' + (keyByIndex.len ? 'has-items' : 'is-empty');
    }
    else {
      topicEl = document.createElement('span');
      topicEl.className = 'json-' + type;
      topicEl.textContent = type == 'null' ? 'null' : type != 'boolean' ? topic : topic ? 'true' : 'false';
    }

    // Iterate over children of array object
    if (keyByIndex) {

      // Add "array[...]" or "object[...]" type/description
      const valueEl = document.createElement('span');
      valueEl.className = 'json-type';
      valueEl.textContent = keyByIndex.len ? type + '[' + keyByIndex.len + ']': '{}';
      parentEl.appendChild(valueEl);

      // Create child nodes for array or object
      for (let i = 0; i < keyByIndex.len; i++) {
        const key = keyByIndex(i);
        const itemEl = document.createElement('div');
        const keyEl = document.createElement('span');

        keyEl.className = 'json-key';
        keyEl.textContent = key;
        itemEl.appendChild(keyEl);
        topicEl.appendChild(itemEl);
        queue.push([topic[key], itemEl]);
      }
    }

    parentEl.className = 'json-item ' + topicEl.className.replace(/^json-/, 'contains-');
    parentEl.appendChild(topicEl);
  }

  return rootEl;
}

module.exports = {jsonToHtml};
