import parse5, {Parser} from 'parse5'
import R from 'ramda'



function traverse(entry, func) {
  if (!entry.childNodes) return

  entry.childNodes.forEach((item, idx) => {
    func.apply(this, [item, idx])
    traverse(item, func)
  })
}

function findNode(node, filters) {

  let result = []
  let f = R.allPass(filters)
  traverse(node, function(n, idx) {
    if (f(n)) {
      result.push({node: n, index: idx})
    }
  })
  return result
}

class HtmlProcessor {
  constructor(doc) {
    this._doc = doc
    this._parser = new Parser()
    this._document = undefined
    this._html = undefined
    this._serializer = new parse5.Serializer()
  }

  ast() {
    this._document = this._document || this._parser.parse(this._doc)
    console.log()
    return this
  }

  serialize() {
    if (this._document) {
      this._html = this._serializer.serialize(this._document)
    }
    return this    
  }



  changeCSS() {
    if (!this._document) return this


    let items = findNode(this._document, [
      (x) => x.nodeName == 'link',
      (x) => R.contains({ name: 'rel', value: 'stylesheet' }, x.attrs)
    ])
    console.log(items[0].node.parentNode.childNodes)

    R.map((item) => {
      item.node.parentNode.childNodes[item.index] = {
        nodeName: '#text',
        value: '',
        parentNode: item.node.parentNode
      }
    }, items)

    items[0].node.parentNode.childNodes.push({
      nodeName: 'link',
      tagName: 'link',
      attrs: [{ name: 'rel', value: 'stylesheet' },
              { name: 'href', value: '/css/generated.css' }],
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      childNodes: [],
      parentNode: items[0].node.parentNode
    })
    return this    
  }

  output() {
    return this._html
  }
}

module.exports = HtmlProcessor

