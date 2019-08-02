/**
 * `jsonToHtml()` takes any type (object, array, string, null, ...) and converts
 * it to a DOM structure.
 *
 * This function does not do any styling, and it does also does not provide any
 * click events. See the examples on [github](https://github.com/jhthorsen/jsontohtml)
 * for information on how to do that.
 *
 * What it does however, is that it adds many classes to the DOM elements, so
 * you style and modify it however you like.
 *
 * @example
 * // Import the function
 * const {jsonToHtml} = require('@jhthorsen/jsontohtml');
 *
 * // <span class="json-boolean">true</span>
 * const domNode = jsonToHtml(true);
 *
 * // <span class="json-number">42</span>
 * const domNode = jsonToHtml(42);
 *
 * // <span class="json-string">foo</span>
 * const domNode = jsonToHtml('foo');
 *
 * // <span class="json-null">null</span>
 * const domNode = jsonToHtml(null);
 * const domNode = jsonToHtml(undefined);
 *
 * // <div class="json-array is-empty"></div>
 * const domNode = jsonToHtml([]);
 *
 * // <div class="json-object is-empty"></div>
 * const domNode = jsonToHtml({});
 *
 * // <div class="json-object has-items">
 * //   <div class="json-item contains-number">
 * //     <span class="json-key">age</span><span class="json-number">36</span>
 * //   </div>
 * //   <div class="json-item contains-array has-items">
 * //     <span class="json-key">languages</span><span class="json-type">array[2]</span>
 * //     <div class="json-array has-items">
 * //       <div class="json-item contains-string">
 * //         <span class="json-key">0</span><span class="json-string">norwegian</span>
 * //       </div>
 * //       <div class="json-item contains-string">
 * //         <span class="json-key">1</span><span class="json-string">english</span>
 * //       </div>
 * //     </div>
 * //   </div>
 * // </div>
 * const domNode = jsonToHtml({age: 36, languages: ['norwegian', 'english']});
 *
 * @param {Any} json An object, array, string, ...
 * @returns HTMLDomElement A DOM element
 */
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
