
exports.componentTemplate = (comp, list) => {
  const listProps = comp.props.reduce((acc, item) => {
    const schema = {
      type: 'tr',
      content: [
        {
          type: 'th',
          attributes: { scope: 'row' },
          content: item.name
        },
        {
          type: 'td',
          content: item.type
        },
        {
          type: 'td',
          content: item.required
        },
        {
          type: 'td',
          content: item.default
        },
        {
          type: 'td',
          content: item.description
        },
      ]
    }
    acc.push(schema)

    return acc
  }, [])

  return [
    {
      type: 'head',
      content: [
        { type: 'title', content: comp.name },
        {
          type: 'link',
          attributes: {
            rel: "stylesheet",
            href: "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
            integrity: "sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk",
            crossorigin: "anonymous"
          }
        },
        {
          type: 'link', attributes: {
            rel: "stylesheet", href: "style.css"
          }
        },
      ],

    },
    {
      type: 'body',
      content: [
        {
          type: 'main',
          attributes: { class: 'container-fluid h-100 white-bg primary-dark-text' },
          content: [
            {
              type: 'div',
              attributes: { class: 'row h-100' },
              content: [
                {
                  type: 'aside',
                  attributes: { class: 'col-3 primary-bg white-text pt-4' },
                  content: [
                    {
                      type: 'h2',
                      attributes: { class: 'mb-4' },
                      content: 'VUE JSDOC PARSE'
                    },
                    {
                      type: 'ul',
                      attributes: { class: 'navbar-nav mr-auto', id: 'sideBarList' },
                      content: list
                    }
                  ],
                },
                {
                  type: 'div',
                  attributes: { class: 'col-9 white-bg' },
                  content: [
                    {
                      type: 'div',
                      attributes: { class: 'container mt-4' },
                      content: [
                        {
                          type: 'h3',
                          content: comp.name
                        },
                        {
                          type: 'section',
                          content: [
                            {
                              type: 'div',
                              attributes: { class: 'pt-4' },
                              content: [
                                {
                                  type: 'h4',
                                  content: 'Props'
                                },
                                {
                                  type: 'table',
                                  attributes: { class: 'table table-sm table-striped' },
                                  content: [
                                    {
                                      type: 'thead',
                                      content: [
                                        {
                                          type: 'tr',
                                          content: [
                                            {
                                              type: 'th',
                                              attributes: { scope: 'col' },
                                              content: 'Name'
                                            },
                                            {
                                              type: 'th',
                                              attributes: { scope: 'col' },
                                              content: 'type'
                                            },
                                            {
                                              type: 'th',
                                              attributes: { scope: 'col' },
                                              content: 'Required'
                                            },
                                            {
                                              type: 'th',
                                              attributes: { scope: 'col' },
                                              content: 'Default'
                                            },
                                            {
                                              type: 'th',
                                              attributes: { scope: 'col' },
                                              content: 'Description'
                                            },
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      type: 'tbody',
                                      content: listProps
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'section',
                          content: [
                            {
                              type: 'div',
                              attributes: { class: 'pt-4' },
                              content: [
                                {
                                  type: 'h4',
                                  content: 'Methods'
                                },
                                {

                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'section',
                          content: [
                            {}
                          ]
                        }
                      ]
                    }
                  ]
                }

              ]
            }
          ],
        },

      ],
    },
  ] // return
}

exports.css = `
 .primary-bg{
  background-color: #388087;
 }
 .primary-text{
   color: #388087;
  }
.primary-dark-bg{
 background-color: #14494E;
}
.primary-dark-text{
  color: #14494E;
 }
 .primary-light-bg{
  background-color: #BADFE7;
 }
 .primary-light-text{
   color: #BADFE7;
  }
.white-bg {
  background-color: #F6F6F2;
}
.white-text {
  color: #F6F6F2;
}
.secondary-bg{
  background-color: #C2EDCE;
}

.secondary-text{
  color: #C2EDCE;
}

ul li a,
a:visited {
  color:  #F6F6F2
}

a:hover {
  color: #C2EDCE
}
html, body {
  height: 100vh;
}

/* overrides */
.table {
  color: #14494E;
}
.table-striped tbody tr:nth-of-type(odd) {
 background-color: #BADFE7;
}
a.nav-link.active {
  color: #C2EDCE
}
`
