import HaiEnum from './hai-enum';
import store from './store';
import {setNextTalk} from './action';

export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

export function next(talkName, overwriteOpts = {}) {
  if (talkName instanceof HaiEnum) {
    return talkName.fn();
  }

  const {talks} = store.getState();
  let target = null;

  for (const talk of talks) {
    if (talk.name === talkName) {
      target = talk;
      break;
    }
  }

  if (typeof overwriteOpts === 'object') {
    target = Object.assign({}, target, overwriteOpts);
  }

  store.dispatch(setNextTalk(target));
}

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
