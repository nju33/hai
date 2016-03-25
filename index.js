var exists = false;

var WIDTH = 120;

function Hai(/* caption, ...btns, opts */) {
  var lastArg = arguments[arguments.length - 1];
  if (lastArg == null) {
    throw Error('Button is required');
  }

  this.caption = arguments[0];
  this.btns = Array.prototype.slice.call(arguments, 1);

  this.opts = {
    timeout: false,
    coverEvent: true,
  };
  if (typeof lastArg === 'object') {
    var opts = this.btns.pop();
    if (opts.timeout != null) {
      this.opts.timeout = opts.timeout;
    }
    if (opts.coverEvent != null) {
      this.opts.coverEvent = opts.coverEvent;
    }
  }

  this.callback = null;
  this._el = null;
  this._events = [];

  if (!exists) {
    injectStyle();
    exists = true;
  }
}

Hai.prototype.show = (function() {
  var cb;

  return function show(e) {
    setTimeout(function() {
      if (!this.callback) {
        return;
      }

      if (this._el == null) {
        var btnEls = generateButtonEls.call(this);
        this._el = document.createElement('div');
        this._el.className = 'hai__box';
        this._el.innerHTML = generateInnerHTML(this.caption, btnEls);
        if (this.opts.coverEvent) {
          this._el.children[0].addEventListener('click', this.hide.bind(this));
        }
        insertBtn(this._el, btnEls);
        insert(this._el);
      }

      move(this._el, e.clientX, e.clientY);
      setTimeout(function() {
        active(this._el);
      }.bind(this), 0);

      if (this.opts.timeout) {
        try {
          setTimeout(this.hide.bind(this), this.opts.timeout);
        } catch (e) {
          throw Error(e);
        }
      }
    }.bind(this), 0);
    return {
      then: function(callback) {
        if (typeof callback !== 'function') {
          throw Error('Please specify the function');
        }
        this.callback = (function(callback) {
          var _this = this;
          return function(idx) {
            callback(idx);
            this.hide();
          };
        }).call(this, callback);
      }.bind(this),
    };
  }
})();

Hai.prototype.hide = function hide() {
  inactive(this._el);
}

function generateInnerHTML(caption, btnEls) {
  return '<div class="hai__cover"></div>' +
         '<div class="hai__inner">' +
           '<div class="hai__header">' +
             '<span class="hai__caption">' + caption + '</span>' +
           '</div>' +
           '<div class="hai__body hai__btns--' + btnEls.length + '">' +
           '</div>' +
         '</div>';
}

function generateButtonEls(btns) {
  var btnEls = [];
  for (var i = 0, len = this.btns.length; i < len; i++) {
    var a = document.createElement('a');
    a.setAttribute('role', 'button');
    a.className = 'hai__btn';
    a.innerText = this.btns[i];

    var handle = this.callback.bind(null, i);
    a.addEventListener('click', handle, false);
    this._events.push(handle);
    btnEls.push(a);
  }
  return btnEls;
}

function insert(el) {
  document.body.appendChild(el);
}

function insertBtn(parentEl, btnEls) {
  var btnBody = parentEl.children[1].children[1];
  for (var i = 0, len = btnEls.length; i < len; i++) {
    btnBody.appendChild(btnEls[i]);
  }
}

function move(el, left, top) {
  left -= WIDTH / 2;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
}

function active(el) {
  var height = el.children[1].clientHeight;
  el.style.height = height + 'px';
  el.className += ' hai__box--active';
}

function inactive(el) {
  el.style.height = 0;
  el.className = 'hai__box';
}

function injectStyle() {
  var style = document.createElement('style');
  var css = '.hai__box {' +
              'position: absolute;' +
              'overflow: hidden;' +
              'min-width: ' + WIDTH + 'px;' +
              'height: 0;' +
              '-webkit-transition: .2s linear height;' +
              'transition: .2s linear height;' +
            '}' +
            '.hai__cover {' +
              'position: fixed;' +
              'left: 0;' +
              'top: 0;' +
              '-webkit-transition: .2s linear;' +
              'transition: .2s linear;' +
            '}' +
            '.hai__box--active .hai__cover {' +
              'width: ' + window.innerWidth + 'px;' +
              'height: ' + window.innerHeight + 'px;' +
              'background: hsla(0, 0%, 0%, .3);' +
            '}' +
            '.hai__inner {' +
              'position: relative;' +
              'z-index: 99999;' +
              'background: #e98b2a;' +
            '}' +
            '.hai__header {' +
              'text-align: center;' +
              'font-weight: bold;' +
              'box-sizing: border-box;' +
              'padding: .7em;' +
            '}' +
            '.hai__body {' +
              'overflow: hidden;' +
              'border-top: 1px solid hsla(0, 0%, 0%, .1);' +
              'text-align: center;' +
            '}' +
            '.hai__btn {' +
              'display: block;' +
              'box-sizing: border-box;' +
              'padding: .7em;' +
              'cursor: pointer;' +
              'background: #f0b16f;' +
              '-webkit-transition: .2s linear background;' +
              'transition: .2s linear background;' +
            '}' +
            '.hai__btn:active {' +
              'background: #f0bc6f;' +
            '}'
            ;
  style.innerHTML = css;
  document.head.appendChild(style);
}
