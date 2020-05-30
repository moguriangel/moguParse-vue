const htmlCreator = require('html-creator');

exports.component = new htmlCreator([
  {
    type: 'head',
    content: [
      { type: 'title', content: 'component.displayName' },
      {
        type: 'link', attributes: {
          rel: "stylesheet", href: "style.css"
        }
      }
    ],

  },
  {
    type: 'body',
    attributes: { style: 'padding: 1rem' },
    content: [
      {
        type: 'div',
        content: [
          {
            type: 'span',
            content: 'A Button Span Deluxe',
            attributes: { className: 'button' },
          },
          {
            type: 'a',
            content: 'Click here',
            attributes: { href: '/path-to-infinity', target: '_blank' },
          },
        ],
      },
    ],
  },
]);

exports.index = new htmlCreator([
  {
    type: 'head',
    content: [{ type: 'title', content: 'component.displayName' }]
  },
  {
    type: 'body',
    attributes: { style: 'padding: 1rem' },
    content: [
      {
        type: 'div',
        content: [
          {
            type: 'span',
            content: 'A Button Span Deluxe',
            attributes: { className: 'button' },
          },
          {
            type: 'a',
            content: 'Click here',
            attributes: { href: '/path-to-infinity', target: '_blank' },
          },
        ],
      },
    ],
  },
]);

exports.css = `
 body {
   background: red
 }
`