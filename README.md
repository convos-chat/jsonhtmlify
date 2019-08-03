<a name="module_jsonhtmlify"></a>

## jsonhtmlify ⇒ <code>HTMLElement</code>
`jsonhtmlify()` takes any type (object, array, string, null, ...) and converts
it to a DOM structure.

This function does not do any styling, and it does also does not provide any
click events. See the examples on [github](https://github.com/jhthorsen/jsontohtml)
for information on how to do that.

What it does however, is that it adds many classes to the DOM elements, so
you style and modify it however you like.

**Returns**: <code>HTMLElement</code> - A DOM element.  

| Param | Type | Description |
| --- | --- | --- |
| json | <code>Any</code> | An array, boolean, null, number, object or string. |

**Example**  
```js
// Import the function
const {jsonhtmlify} = require('jsonhtmlify');

// <span class="json-boolean">true</span>
const domNode = jsonhtmlify(true);

// <span class="json-number">42</span>
const domNode = jsonhtmlify(42);

// <span class="json-string">foo</span>
const domNode = jsonhtmlify('foo');

// <span class="json-null">null</span>
const domNode = jsonhtmlify(null);
const domNode = jsonhtmlify(undefined);

// <div class="json-array is-empty"></div>
const domNode = jsonhtmlify([]);

// <div class="json-object is-empty"></div>
const domNode = jsonhtmlify({});

// <div class="json-object has-items">
//   <div class="json-item contains-number">
//     <span class="json-key">age</span><span class="json-number">36</span>
//   </div>
//   <div class="json-item contains-array has-items">
//     <span class="json-key">languages</span><span class="json-type">array[2]</span>
//     <div class="json-array has-items">
//       <div class="json-item contains-string">
//         <span class="json-key">0</span><span class="json-string">norwegian</span>
//       </div>
//       <div class="json-item contains-string">
//         <span class="json-key">1</span><span class="json-string">english</span>
//       </div>
//     </div>
//   </div>
// </div>
const domNode = jsonhtmlify({age: 36, languages: ['norwegian', 'english']});
```
