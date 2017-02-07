(function () {
  var talk1 = new Hai([
    {
      name: 'question',
      message: 'Do you want something to eat?',
      button: [
        ['Yes', function (next, names) {
          next(names.type);
        }],
        ['No', function (next) {
          next(Hai.CANCEL);
        }]
      ]
    },
    {
      name: 'type',
      message: 'Which do you want to eat?',
      button: {
        direction: 'virtical',
        items: [
          ['Meat', function (next, names) {
            next(names.meat);
          }],
          ['Fish', function (next, names) {
            next(names.fish);
          }]
        ]
      }
    },
    {
      name: 'meat',
      message: 'What meat eat?',
      convenient: [ // radio
        ['Beef', 'beef'],
        ['Poke', 'poke'],
        ['Chicken', 'chicken'],
        ['Other', 'other']
      ],
      button: [
        ['Next', function (next, names) {
          if (this.value === 'other') {
            next(names.other, {
              name: this.name,
              message: 'Enter the meat you want to eat.'
            });
          } else {
            next(names.done);
          }
        }]
      ]
    },
    {
      name: 'fish',
      message: 'What fish eat?',
      convenient: [ // radio
        ['Salmon', 'salmon'],
        ['Tuna', 'tuna'],
        ['Mackerel', 'mackerel'],
        ['Other', 'other']
      ],
      button: [
        ['Next', function (next, names) {
          if (this.value === 'other') {
            next(names.other, {
              name: this.name,
              message: 'Enter the fish you want to eat.'
            });
          } else {
            next(names.done);
          }
        }]
      ]
    },
    {
      name: 'other',
      convenient: 'input',
      button: [
        ['Submit', function (next, names) {
          next(names.done);
        }]
      ]
    },
    {
      name: 'done',
      message: 'Got it.',
      convenient: {
        type: 'text',
        text: 'I will make it in a hurry, please wait for a while.'
      },
      button: [
        ['I got it', function (next) {
          next(Hai.DONE);
        }, false]
      ]
    }
  ]);
  var food = document.getElementById('food');
  food.addEventListener('click', handleFood, null);
  function handleFood(e) {
    talk1
      .open(e.currentTarget)
      .then(answers => {
        // document.getElementById('answer').innerText = JSON.stringify(answers);
        console.log(answers);
      });
  }

  var talk2 = new Hai([
    {
      name: 'agreement',
      message: 'To proceed, please read the following and agree.',
      convenient: {
        type: 'text',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.'
      },
      buttons: [
        ['No', function (next) {
          next(Hai.CANCEL)
        }],
        ['Agree', function (next, names) {
          next(names.done)
        }]
      ]
    },
    {
      name: 'done',
      message: 'thanks',
      buttons: [
        ['Done', function (next) {
          next(Hai.DONE);
        }, false]
      ]
    }
  ]);
  var agreement = document.getElementById('agreement');
  agreement.addEventListener('click', handleAgreement, null);
  function handleAgreement(e) {
    talk2
      .open(e.currentTarget)
      .then(answers => {
        console.log(answers);
      });
  }
})();
