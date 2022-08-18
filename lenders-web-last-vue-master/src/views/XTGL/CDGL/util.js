/*
 * @pidName 父节点id
 */
export function toTree(list, idName, pidName) {
  const obj = {}
  list.forEach((e, index) => {
    e.index = index
    obj[e[idName]] = e
  })
  list.forEach(e => {
    if (e[pidName]) {
      if (obj[e[pidName]]) {
        let pitem = list[obj[e[pidName]].index]
        if (!pitem.children) pitem.children = []
        pitem.children.push(e)
        e.r = true
      }
    }
  })
  return list.filter(i => !i.r)
}

// 查找树中的节点
export function findTreeNode(nodeList, key, val) {
  if (!nodeList || nodeList.length <= 0) return
  for (let e of nodeList) {
    if (e[key] === val) return e
    else {
      let rlt = findTreeNode(e.children, key, val)
      if (rlt) return rlt
    }
  }
}
