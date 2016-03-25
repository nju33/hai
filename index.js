let handle;
const cache = {};

const handler = {
  exec: function exec(id, cap, btns) {
    const id = document.getElementById(id);
    if (id) {
      throw Error(`Not found id: ${id}`);
    }

    cache[id] = this.generate(cap, btns);
  },
  add: function(cap, btns) {
    const el = generateDOM(cap, btns);
    document.getElementsByTagName('body')[0].appendChild(el);
  },
}


export default function hai(id, cap, ...btns) {
  if (btns.length) {
    throw Error('err');
  }

  setTimeout(handler.exec.bind(handler, id, cap, btns), 0);

  return {
    then(_handle) {
      handle = _handle;
    }
  };
}

function generateDOM(cap, btns) {
  const templateBtn = (function() {
    let result = '';

    for (let i = 0, len = btns.length; i < len; i++) {
      result += `
        <a>${btns[i]}</a>
      `;
    }
  })();
  const templateAll = `
    <div class="hai__box">
      <div class="hai__header">
        <span class="hai__cap">${cap}</span>
      </div>
      <div class="hai__body">
      </div>
    </div>
  `;
  const hai = document.createElement('div');
  hai.outerHTML = templateAll;
  return hai;
}
