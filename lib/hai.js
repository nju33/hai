import HaiContainer from './components/HaiContainer.html';
import MenuBox from './components/MenuBox.html';
import MessageBox from './components/MessageBox.html';
import ConvenientBox from './components/ConvenientBox.html';
import ButtonBox from './components/ButtonBox.html';
import HaiEnum from './hai-enum';
import {setTalks, resetTalks} from './action';
import store from './store';
import {createComponentElement} from './helpers';
import style from './style.css';

let components = [];

function ensure(talks) {
  return talks.map(talk => {
    talk.convenient = ensureConvenient(talk.convenient);
    talk.button = ensureButton(talk.button);
    return talk;
  });
}

function ensureConvenient(convenient) {
  if (!convenient) {
    return null;
  }

  if (typeof convenient !== 'string' && typeof convenient !== 'object') {
    throw new Error('`convenient` can be a string, an array or an object');
  }

  if (typeof convenient === 'string' && convenient === 'input') {
    return {
      type: 'input'
    };
  } else if (Array.isArray(convenient)) {
    return {
      type: 'radio',
      items: convenient
    };
  }
  return convenient;
}

function ensureButton(button) {
  if (!button) {
    return null;
  }

  if (typeof button !== 'object') {
    throw new Error('For `button`, specify an array or object');
  }

  if (Array.isArray(button)) {
    button = {
      direction: 'horizontal',
      items: button
    };
  }

  button.items.map(item => {
    if (item.length === 2) {
      // including
      item.push(true);
    }
    return item;
  });

  return button;
}

const defaultOpts = {
  convenientClassName: false,
  convenientPrefixClassName: 'hai__',
  duration: 200,
  easing: 'linear'
};

export default class Hai {
  static first = true;
  firstOpen = true;

  static config = {
    theme: 'dark'
  }

  static DONE = new HaiEnum(() => {
    const {answers} = store.getState();
    if (typeof Hai.callback === 'function') {
      Hai.callback(answers);
    }
    store.dispatch(resetTalks());
    Hai.container.hide();
  });

  static CANCEL = new HaiEnum(() => {
    store.dispatch(resetTalks());
    Hai.container.hide();
  });

  constructor(talks, opts = {}) {
    this.talks = ensure(talks);
    opts = this.opts = Object.assign({}, defaultOpts, opts);
    this.helpers = {
      waitDuringDuration() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, opts.duration || 200);
        });
      }
    };

    if (Hai.first) {
      Hai.init();
      Hai.first = false;
    }
  }

  open(elem) {
    Hai.this = this;

    if (this.firstOpen) {
      this.firstOpen = false;
    } else {
      reset();
    }

    requestAnimationFrame(() => {
      const boundingClientRect = elem.getBoundingClientRect();
      Hai.container.set({elem, boundingClientRect});
      store.dispatch(setTalks(Hai.this.talks));
    });

    return {
      then(callback) {
        if (typeof callback !== 'function') {
          throw new Error('Specify a function for callback');
        }
        Hai.callback = callback;
      }
    };
  }

  close() {
    if (Hai.container.isVisible()) {
      Hai.container.hide();
    }
  }

  static init() {
    insertStyle(style);
    const container = createComponentElement(HaiContainer);
    const menuBox = createComponentElement(MenuBox);
    const messageBox = createComponentElement(MessageBox);
    const convenientBox = createComponentElement(ConvenientBox);
    const buttonBox = createComponentElement(ButtonBox);

    [menuBox, messageBox, convenientBox, buttonBox].forEach(item => {
      container.component.appendComponent(item.element);
    });
    document.body.appendChild(container.element);

    Hai.container = container.component;
    Hai.menuBox = menuBox.component;
    Hai.messageBox = messageBox.component;
    Hai.convenientBox = convenientBox.component;
    Hai.buttonBox = buttonBox.component;
    components = [
      Hai.container,
      Hai.menuBox,
      Hai.messageBox,
      Hai.convenientBox,
      Hai.buttonBox
    ];

    Hai.dispose = store.subscribe((() => {
      let oldState = {};

      return () => {
        const state = store.getState();

        if (process.env.NODE_ENV === 'development') {
          console.info(state.lastType);
        }

        if (state.active === null && Hai.container.isVisible()) {
          Hai.container.hide();
        }

        if (state.active && state.active !== oldState.active) {
          Hai.container.setPosition();
          if (!Hai.container.isVisible()) {
            setData(state.active);
            Hai.container.show();
          }
        }

        if (state.active && oldState.active &&
            JSON.stringify(state.active) !== JSON.stringify(oldState.active)) {
          components.forEach(() => (
            setData(state.active, state.answers[state.active.name])
          ));
          Hai.menuBox.set({
            back: state.back,
            forward: state.forward
          });
        }

        if (oldState.active && state.active &&
            state.active.name === oldState.active.name) {
          Hai.convenientBox.set({value: state.answers[state.active.name]});
          Hai.buttonBox.set({value: state.answers[state.active.name]});
        }

        oldState = state;
      };
    })());
  }
}

function reset() {
  components.forEach(component => {
    if (typeof component.reset === 'function') {
      component.reset();
    }
  });
}

function setData(active, value = null) {
  const data = Object.assign({}, active, {
    value,
    config: Hai.config,
    helpers: Hai.this.helpers
  });

  components.forEach(component => {
    component.set(data);
  });
}

function insertStyle(styleText) {
  const styleElem = document.createElement('style');
  styleElem.innerHTML = styleText;
  document.head.appendChild(styleElem);
}
