
exports.componentTemplate = (comp, list) => {
  const listProps = comp.props.map(item => {
    return {
      type: 'li',
      content: item.displayName
    }
  })
  return [
    {
      type: 'head',
      content: [
        { type: 'title', content: comp.displayName },
        {
          type: 'link', attributes: {
            rel: "stylesheet", href: "style.css"
          }
        },
        {
          type: 'link',
          attributes: {
            rel: "stylesheet",
            href: "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
            integrity: "sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk",
            crossorigin: "anonymous"
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
              content: `nome componente ${comp.displayName}`,
              attributes: { className: 'button' },
            },
            {
              type: 'a',
              content: 'Click here',
              attributes: { href: '/path-to-infinity', target: '_blank' },
            },
          ],
        },
        {
          type: 'ul',
          attributes: { id: 'sideBarList' },
          content: list
        }
      ],
    },
  ]
}

exports.css = `
 body {
   background: blue
 }
`
