export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

export function isElement(elem) {
  return elem.nodeType;
}

/**
 * Render component into new element
 * @param  {string} id        [description]
 * @param  {string} className [description]
 * @param  {object} Component [description]
 * @param  {Object} [data={}] [description]
 * @return {object}           [description]
 */
export function createComponentElement(Component, data = {}) {
  const parent = document.createElement('div');
  const component = new Component({
    target: parent,
    data
  });

  return {
    element: parent.children[0],
    component
  };
}
