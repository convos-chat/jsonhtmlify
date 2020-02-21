/**
 * `jsonhtmlify()` takes any type (object, array, string, null, ...) and converts
 * it to a DOM structure.
 *
 * This function does not do any styling, and it does also does not provide any
 * click events. See the examples on [github](http://htmlpreview.github.io/?https://github.com/jhthorsen/jsonhtmlify/blob/master/examples/index.html)
 * for information on how to do that.
 *
 * What it does however, is that it adds many classes to the DOM elements, so
 * you style and modify it however you like.
 *
 * @example
 * // Import the function
 * const {jsonhtmlify} = require('jsonhtmlify');
 *
 * // <span class="json-boolean">true</span>
 * const domNode = jsonhtmlify(true);
 *
 * // <span class="json-number">42</span>
 * const domNode = jsonhtmlify(42);
 *
 * // <span class="json-number">42</span><span class="json-comma is-trailing">,</span>
 * const domNode = jsonhtmlify(42, {allTags: true});
 *
 * // <span class="json-string">foo</span>
 * const domNode = jsonhtmlify('foo');
 *
 * // <span class="json-null">null</span>
 * const domNode = jsonhtmlify(null);
 * const domNode = jsonhtmlify(undefined);
 *
 * // <div class="json-array is-empty"></div>
 * const domNode = jsonhtmlify([]);
 *
 * // <div class="json-object is-empty"></div>
 * const domNode = jsonhtmlify({});
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
 * const domNode = jsonhtmlify({age: 36, languages: ['norwegian', 'english']});
 *
 * @param {Any} json An array, boolean, null, number, object or string.
 * @param {Object} options Pass on extra instructions. See examples
 * @returns {HTMLElement} A DOM element.
 */
function jsonhtmlify(json, options) {
  let rootEl = document.createElement('div');
  const queue = [[json, rootEl, {last: true}]];
  const visited = [];

  const allTags = options && options.allTags;

  TOPIC:
  while (queue.length) {
    const [topic, parentEl, topicParams] = queue.shift();
    const commaClassName = 'json-comma' + (topicParams.last ? ' is-trailing' : '');
    let topicEl, keyByIndex;

    // Figure out the type we are working with
    let type = typeof topic; // boolean, number, string, ...
    if (topic === null || type == 'undefined') {
      type = 'null';
    }
    else if (Array.isArray(topic)) {
      type = 'array';
    }

    // Convert topic to a DOM element
    if (type == 'array') {
      keyByIndex = (i) => i;
      keyByIndex.len = topic.length;
      textNode(parentEl, 'json-type', keyByIndex.len ? 'array[' + keyByIndex.len + ']': '[]');
      if (allTags) textNode(parentEl, commaClassName, ',');
      topicEl = wrapperNode(parentEl, 'json-array ' + (keyByIndex.len ? 'has-items' : 'is-empty'));
    }
    else if (type == 'object') {
      const keys = Object.keys(topic).sort();
      keyByIndex = (i) => keys[i];
      keyByIndex.len = keys.length;
      textNode(parentEl, 'json-type', keyByIndex.len ? 'object[' + keyByIndex.len + ']': '{}');
      if (allTags) textNode(parentEl, commaClassName, ',');
      topicEl = wrapperNode(parentEl, 'json-object ' + (keyByIndex.len ? 'has-items' : 'is-empty'));
    }
    else {
      topicEl = textNode(parentEl, 'json-' + type, type == 'null' ? 'null' : type != 'boolean' ? topic : topic ? 'true' : 'false');
      if (allTags) textNode(parentEl, commaClassName, ',');
    }

    // Iterate over children
    if (keyByIndex) {

      // Guard against recursive structures
      if (visited.indexOf(topic) != -1) {
        rootEl.classList.add('has-recursive-items');
        topicEl.classList.add('is-seen');
      }
      else {
        // Create child nodes for array or object
        for (let i = 0; i < keyByIndex.len; i++) {
          const key = keyByIndex(i);
          const itemEl = wrapperNode(topicEl, '');
          textNode(itemEl, 'json-key', key);
          if (allTags) textNode(itemEl, 'json-colon', ':');
          queue.push([topic[key], itemEl, {last: i + 1 == keyByIndex.len}]);
        }

        visited.push(topic);
      }
    }

    parentEl.className = 'json-item ' + topicEl.className.replace(/^json-/, 'contains-');
  }

  return rootEl;
}

function wrapperNode(parentEl, className) {
  const el = document.createElement('div');
  el.className = className;
  parentEl.appendChild(el);
  return el;
}

function textNode(parentEl, className, text) {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = text;
  parentEl.appendChild(el);
  return el;
}

// Not very pretty, but seems to work
try {
  module.exports = {jsonhtmlify};
} catch(err) {
  window.jsonhtmlify = jsonhtmlify;
}
