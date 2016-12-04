import HaiContainer from './components/HaiContainer.html';
import MenuBox from './components/MenuBox.html';
import MessageBox from './components/MessageBox.html';
import ConvenientBox from './components/ConvenientBox.html';
import ButtonBox from './components/ButtonBox.html';
import {ANSWER_TALK, TOGGLE_CONVENIENT_ITEM, SET_EVENT,
        setTalks, stepTalk, resetTalks, answerTalk, setEvent} from './action';
import store from './store';
import {isElement, createComponentElement} from './helpers';
import style from './style.css';

let first = true;

const defaultOpts = {
  name: null,
  message: null,
  convenient: {
    type: null,
    items: []
  },
  buttons: []
};

export default class Hai {
  static boundData = null;
  static container = null;
  static header = null;
  static body = null;
  static footer = null;

  static button = {
    step(propName, label, value = null) {
      return {
        callback() {
          store.dispatch(answerTalk({
            [propName]: this.value
          }));
          store.dispatch(stepTalk(1));
        },
        label,
        value
      };
    },
    cancel(label) {
      return {
        callback() {
          store.dispatch(resetTalks());
        },
        label
      };
    }
  };

  constructor(opts) {
    opts = Object.assign({}, defaultOpts, opts);
    this.name = opts.name;
    this.message = opts.message;
    this.convenient = opts.convenient;
    this.buttons = opts.buttons;

    if (first) {
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

      first = false;
    }
  }

  static openWith(elem, talks, callbacks = {}, end) {
    setTimeout(() => {
      if (!isElement(elem)) {
        throw new Error('It is not an element');
      }

      if (!talks) {
        throw new Error('Please specify an array of an instance of the Hai');
      }

      validateTalks(talks, callbacks, end);

      store.dispatch(setEvent(callbacks));

      Hai.boundData = elem.getBoundingClientRect();
      Hai.convenientBox.set({callbacks, end});
      Hai.buttonBox.set({callbacks, end});
      store.dispatch(setTalks(talks));
    }, 0);
    return Hai;
  }

  static on(eventName, callback) {
    const event = {};
    event[eventName] = callback;
    store.dispatch(setEvent(event));
    return Hai;
  }
}

store.subscribe((() => {
  return () => {
    const {lastType, selected, active, currentIdx} = store.getState();

    if (lastType === ANSWER_TALK || lastType === SET_EVENT) {
      return;
    }

    if (lastType === TOGGLE_CONVENIENT_ITEM) {
      Hai.convenientBox.set({selected});
      Hai.buttonBox.set({selected});
      return;
    }

    if (active === null) {
      if (Hai.container.isVisible()) {
        Hai.container.hide();
      }
      return;
    }

    Hai.messageBox.set({
      message: active.message
    });

    Hai.convenientBox.set({
      name: active.name,
      selected: []
    });
    setTimeout(() => {
      Hai.convenientBox.set({
        hasButtons: active.buttons.length > 0
      });
    }, 200);
    if (currentIdx === 0) {
      Hai.convenientBox.set({
        stack: []
      });
    }
    Hai.convenientBox.push(active.convenient);

    Hai.buttonBox.set({
      name: active.name,
      convenientType: active.convenient.type,
      selected: []
    });
    if (currentIdx === 0) {
      Hai.buttonBox.set({stack: []});
    }
    Hai.buttonBox.push(active.buttons);

    if (Hai.container.isVisible()) {
      setTimeout(() => {
        Hai.container.setPosition(Hai.boundData);
      }, 200);
    } else {
      Hai.container.show(Hai.boundData);
    }
  };
})());

/**
 * Insert style into head tag
 * @param  {string} styleText String of css
 * @return {undefined}
 */
function insertStyle(styleText) {
  const styleElem = document.createElement('style');
  styleElem.innerHTML = styleText;
  document.head.appendChild(styleElem);
}

function validateTalks(talks, callbacks) {
  talks.forEach((talk, idx) => {
    if (!('name' in talk)) {
      throw new Error(`No \`name\` in index ${idx}`);
    }

    if (!('message' in talk)) {
      throw new Error(`No \`message\` in index ${idx}`);
    }

    if (!('convenient' in talk) && !('buttons' in talk)) {
      const m = `\`conveninet\` or \`buttons\` is required at idx ${idx}`;
      throw new Error(m);
    }

    if (talk.buttons.length === 0) {
      if (talk.convenient.items.length > 0) {
        if ('items' in talk.convenient) {
          if (['radio', 'checkbox'].indexOf(talk.convenient.name) > -1) {
            talk.convenient.items.forEach(item => {
              if (!('propName' in item)) {
                throw new Error('No `propName` in `convenient.item` object');
              }
            });
          }
        } else {
          const m = `No \`items\` in \`convenient\` object in index ${idx}`;
          throw new Error(m);
        }
      }
    }

    if (talk.buttons.length > 0) {
      if (talk.convenient &&
          ['radio', 'checkbox'].indexOf(talk.convenient.type) &&
          talk.convenient.items &&
          talk.convenient.items.length > 0) {
        talk.convenient.items.forEach((item, itemIdx) => {
          if (callbacks[`${talk.name}:${item.propName}`]) {
            const m = [
              'If there is a button,',
              'you can not specify a callback for Convenient items.',
              `talk index ${idx}, convenient items index ${itemIdx}`
            ].join(' ');
            throw new Error(m);
          }
        });

        // talk.buttons.forEach((button, buttonIdx) => {
        talk.buttons.forEach(button => {
          if (!('propName' in button)) {
            throw new Error('No `propName` in `button.item` object');
          }

          // if (!callbacks[`${talk.name}:${button.propName}`]) {
          //   const m = [
          //     'Need to specify a callback for button.',
          //     `In this case it is probably \`${talk.name}:${button.propName}\``,
          //     `talk index ${idx}, buttons index ${buttonIdx}`
          //   ].join(' ');
          //   throw new Error(m);
          // }
        });
      } else if (talk.convenient.type === 'text') {
        if (!('text' in talk.convenient)) {
          throw new Error('No `text` in `conenient` object');
        }
      }
    }
  });
}
