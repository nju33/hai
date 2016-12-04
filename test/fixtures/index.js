(function () {
  var food = document.getElementById('food');
  food.addEventListener('click', handleFood, null);
  function handleFood(e) {
    Hai.openWith(e.currentTarget, [
      new Hai({
        name: 'question',
        message: 'Do you want something to eat?',
        buttons: [
          Hai.button.cancel('No'),
          Hai.button.step('question', 'Yes', 'yes')
        ]
      }),
      new Hai({
        name: 'type',
        message: 'Which do you want to eat?',
        convenient: {
          type: 'radio',
          items: [
            {
              value: 'meat',
              label: 'Meat'
            },
            {
              value: 'fish',
              label: 'Fish'
            }
          ]
        },
        buttons: [
          {
            propName: 'next',
            label: 'Next'
          }
        ]
      }),
      new Hai({
        name: 'meat',
        message: 'What meat eat?',
        convenient: {
          type: 'checkbox',
          items: [
            {
              value: 'beef',
              label: 'Beef'
            },
            {
              value: 'poke',
              label: 'Poke'
            },
            {
              value: 'chicken',
              label: 'Chicken'
            }
          ]
        },
        buttons: [
          {
            propName: 'next',
            label: 'Next'
          }
        ]
      }),
      new Hai({
        name: 'fish',
        message: 'What fish eat?',
        convenient: {
          type: 'checkbox',
          items: [
            {
              value: 'salmon',
              label: 'Salmon'
            },
            {
              value: 'tuna',
              label: 'Tuna'
            },
            {
              // 鯖
              value: 'mackerel',
              label: 'Mackerel'
            }
          ]
        },
        buttons: [
          {
            propName: 'next',
            label: 'Next'
          }
        ]
      }),
      new Hai({
        name: 'postProcess',
        message: 'Got it.',
        convenient: {
          type: 'text',
          text: 'I will make it in a hurry, please wait for a while.'
        },
        buttons: [
          {
            propName: 'ok',
            value: null,
            label: 'OK'
          }
        ]
      })
    ], {
      'type:next': function (cb) {
        if (this.selected[0] === 'meat') {
          cb.step({
            answer: false
          });
        } else {
          cb.step({
            answer: false,
            count: 2
          });
        }
      },
      'meat:next': function (cb) {
        cb.step({count: 2});
      },
      'postProcess:ok': function (cb) {
        cb.done({answer: false});
      }
    })
    .on('end', function (answers) {
      console.log(answers);
    })
    .on('cancel', function () {
      console.log('cancelled');
    });
  }

  var agreement = document.getElementById('agreement');
  agreement.addEventListener('click', handleAgreement, null);
  function handleAgreement(e) {
    Hai.openWith(e.currentTarget, [
      new Hai({
        name: 'agreement',
        message: 'To proceed, please read the following and agree.',
        convenient: {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.'
        },
        buttons: [
          Hai.button.cancel('No'),
          Hai.button.step('agrement', 'Yes', 'yes')
        ]
      }),
      new Hai({
        name: 'postProcess',
        message: 'thanks',
        buttons: [
          {
            propName: 'done',
            value: null,
            label: 'Done'
          }
        ]
      })
    ], {
      'postProcess:done': function (cb) {
        cb.done();
      },
      end: function (answers) {
        console.log(answers);
      }
    });
  }
})();
