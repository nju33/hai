var hai = (function() {
  'use strict';

  var component = null,
    positiveBtn = null,
    negativeBtn = null,
    offsetTop = 0,
    offsetLeft = 0,
    eventStore = {};

  var calcOffset = function(elem) {
    return {
      left: elem.offsetLeft - ((component.clientWidth - elem.clientWidth) / 2),
      top: elem.offsetTop + component.clientHeight
    };
  };

  var show = function(e) {
    var target = e.currentTarget,
      transform = window.getComputedStyle(target).transform,
      offset = calcOffset(target);

    component.style.position = 'absolute';
    component.style.left = offset.left + 'px';
    component.style.top = offset.top + 'px';

  };

  var createElem = function(title, positiveText, negativeText) {
    var div = document.createElement('div');
    div.innerHTML =
      '<div id="a">' + title + '</div>' +
      '<div>' +
        '<button>' + positiveText + '</button>' +
        '<button>' + negativeText + '</button>' +
      '</div>';
    var btns = div.querySelectorAll('button');
    positiveBtn = btns[0];
    negativeBtn = btns[1];
    return div;
  };

  var insertElem = function(elem) {
    document.body.appendChild(elem);
  };

  var registerEvent = function(elem) {
    elem.addEventListener('click', show);
    positiveBtn.addEventListener('click', function() {
      if (eventStore.positiveClick != null)
        eventStore.positiveClick();
    });
    negativeBtn.addEventListener('click', function() {
      if (eventStore.negativeClick != null)
        eventStore.negativeClick();
    });
  };

  var unregisterEvent = function(elem) {
    elem.removeEventListener('click', clickHandler);
  };

  return {
    create: function(opts) {
      var self = this;
      component = createElem(opts.title, opts.positiveText, opts.negativeText);
      insertElem(component);
      return this;
    },
    bind: function(opts) {
      var elems = document.querySelectorAll(opts.element)
      registerEvent(elems[0]);
      return this;
    },
    on: (function() {
      var methods = [
        function(eventMap) {
          var keys = Object.keys(eventMap);
          for(var i = 0, len = keys.length; i < len; i++) {
            var eventName = keys[i],
              cb = eventMap[eventName];
            eventStore[eventName] = cb;
          }
        },
        function(eventName, cb) {
          eventStore[eventName] = cb
        }
      ];
      return function() {
        if (arguments.length === 1) {
          methods[0].apply(this, arguments);
        } else if (arguments.length === 2) {
          methods[1].apply(this, arguments);
        }
      };
    })()
  };
})();
