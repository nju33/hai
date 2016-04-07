const WIDTH = 120;
let exists = false;

// function Hai(caption, ...btns, opts)
export default function Hai() {
  const lastArg = arguments[arguments.length - 1];
  if (typeof lastArg === 'undefined') {
    throw Error('Button is required');
  }

  this.caption = arguments[0];
  this.btns = Array.prototype.slice.call(arguments, 1);

  this.opts = {
    timeout: false,
    coverEvent: true,
    scrollables: [document.body]
  };
  if (typeof lastArg === 'object') {
    const opts = this.btns.pop();

    if (typeof opts.timeout === 'number') {
      this.opts.timeout = opts.timeout;
    } else {
      throw Error('Not a number');
    }

    if (typeof opts.coverEvent === 'boolean') {
      throw Error('Not a boolean');
    } else {
      this.opts.coverEvent = opts.coverEvent;
    }

    if (Array.isArray(opts.scrollables) && opts.scrollables.length > 0) {
      this.opts.scrollables = opts.scrollables;
    } else {
      throw Error('Not a array || Array is empty');
    }
  }

  this.callback = null;
  this._el = null;
  this._timeoutId = null;
  this._events = [];

  if (!exists) {
    injectStyle();
    exists = true;
  }
}

Hai.prototype.show = function show(e) {
  setTimeout(() => {
    if (!this.callback) {
      return;
    }

    let scrollTop = 0;
    let scrollLeft = 0;
    if (this.opts.scrollables) {
      lockScroll(this.opts.scrollables);
      const scrollVal = calcScrollVal(this.opts.scrollables);
      scrollLeft = scrollVal.left;
      scrollTop = scrollVal.top;
    }

    if (this._el === null) {
      this.btns = generateButtonEls.call(this);
      this._el = document.createElement('div');
      this._el.className = 'hai__box';
      this._el.innerHTML = generateInnerHTML(this.caption, this.btns);
      if (this.opts.coverEvent) {
        this._el.children[0].addEventListener('click', this.hide.bind(this));
      }
      insertBtn(this._el, this.btns);
      insert(this._el);
    }
    addBtnHandler.call(this);

    move(this._el, e.clientX, e.clientY, scrollLeft, scrollTop);
    setTimeout(() => {
      active(this._el);
    }, 0);

    if (this.opts.timeout) {
      try {
        this._timeoutId = setTimeout(this.hide.bind(this), this.opts.timeout);
      } catch (e) {
        throw Error(e);
      }
    }
  }, 0);

  return {
    then(callback) {
      if (typeof callback !== 'function') {
        throw Error('Please specify the function');
      }
      this.callback = (() => {
        return idx => {
          callback(idx);
          this.hide();
        };
      })();
    }
  };
};

Hai.prototype.hide = function hide() {
  if (this._timeoutId) {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
  }

  removeBtnHandler.call(this);

  if (this.opts.scrollables) {
    unlockScroll(this.opts.scrollables);
  }

  inactive(this._el);
};

function generateInnerHTML(caption, btnEls) {
  return [
    '<div class="hai__cover"></div>',
    '<div class="hai__inner">',
    '<div class="hai__header">',
    `<span class="hai__caption">${caption}</span>`,
    '</div>',
    `<div class="hai__body hai__btns--${btnEls.length}">`,
    '</div>',
    '</div>'
  ].join('');
}

function generateButtonEls() {
  const btnEls = [];
  // TODO: Use reduce
  this.btns.forEach(btn => {
    const a = document.createElement('a');
    a.setAttribute('role', 'button');
    a.className = 'hai__btn';
    a.innerText = btn;
    btnEls.push(a);
  });
  return btnEls;
}

function addBtnHandler() {
  this.btns.forEach((btn, idx) => {
    const handle = this.callback.bind(null, idx);
    btn.addEventListener('click', handle, false);
    this._events.push(handle);
  });
}

function removeBtnHandler() {
  this.btns.forEach((btn, idx) => {
    btn.removeEventListener('click', this._events[idx], false);
  });
  this._events = [];
}

function insert(el) {
  document.body.appendChild(el);
}

function calcScrollVal(els) {
  let left = 0;
  let top = 0;

  els.forEach(el => {
    left += el.scrollLeft;
    top += el.scrollTop;
  });
  return {left, top};
}

function insertBtn(parentEl, btnEls) {
  const btnBody = parentEl.children[1].children[1];
  btnEls.forEach(el => {
    btnBody.appendChild(el);
  });
}

function move(el, left, top, scrollLeft, scrollTop) {
  left -= WIDTH / 2;
  left += scrollLeft;
  top += scrollTop;

  if (window.innerWidth < el.children[1].clientWidth + left) {
    left -= el.children[1].clientWidth + left - window.innerWidth;
  }
  if (window.innerHeight < el.children[1].clientHeight + top) {
    top -= el.children[1].clientHeight + top - window.innerHeight;
  }

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

function active(el) {
  const height = el.children[1].clientHeight;
  el.style.height = `${height}px`;
  el.className += ' hai__box--active';
}

function inactive(el) {
  el.style.height = 0;
  el.className = 'hai__box';
}

function lockScroll(els) {
  els.forEach(el => {
    el.style.overflow = 'hidden';
  });
}

function unlockScroll(els) {
  els.forEach(el => {
    el.style.overflow = null;
  });
}

function injectStyle() {
  const style = document.createElement('style');
  const css = [
    '.hai__box {',
    'position: absolute;',
    'overflow: hidden;',
    `min-width: ${WIDTH}px;`,
    'height: 0;',
    '-webkit-transition: .2s linear height;',
    'transition: .2s linear height;',
    '}',
    '.hai__cover {',
    'position: fixed;',
    'left: 0;',
    'top: 0;',
    '-webkit-transition: .2s linear;',
    'transition: .2s linear;',
    '}',
    '.hai__box--active .hai__cover {',
    `width: ${window.innerWidth}px;`,
    `height: ${window.innerHeight}px;`,
    'background: hsla(0, 0%, 0%, .3);',
    '}',
    '.hai__inner {',
    'position: relative;',
    'z-index: 99999;',
    'background: #e98b2a;',
    '}',
    '.hai__header {',
    'text-align: center;',
    'font-weight: bold;',
    'box-sizing: border-box;',
    'padding: .7em;',
    '}',
    '.hai__body {',
    'overflow: hidden;',
    'border-top: 1px solid hsla(0, 0%, 0%, .1);',
    'text-align: center;',
    '}',
    '.hai__btn {',
    'display: block;',
    'box-sizing: border-box;',
    'padding: .7em;',
    'cursor: pointer;',
    'background: #f0b16f;',
    '-webkit-transition: .2s linear background;',
    'transition: .2s linear background;',
    '}',
    '.hai__btn:active {',
    'background: #f0bc6f;',
    '}'
  ].join('');
  style.innerHTML = css;
  document.head.appendChild(style);
}
