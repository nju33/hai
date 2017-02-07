import test from 'ava';
import Nightmare from 'nightmare';

const nightmare = new Nightmare({
  show: process.env.SHOW
});

test('food', async t => {
  const visible = await nightmare
    .goto('http://localhost:3333')
    .click('#food')
    .wait(500)
    .visible('[class*=_box_]');
  t.true(visible);

  const hidden = await nightmare
    .click('[class*=_buttonList_] li:last-child a')
    .wait(500)
    .visible('[class*=_box_]');
  t.false(hidden);

  const completeFood = await nightmare
    .click('#food')
    .wait(1000)
    .click('[class*=_buttonList_] li:first-child a')
    .wait(1000)
    .click('[class*=_buttonList_] li:first-child a') // Meat
    .wait(1000)
    .click('[class*=_convenientList_] li:first-child a') // Beaf
    .click('[class*=_buttonList_] a') // Next
    .wait(1000)
    .click('[class*=_buttonList_] a') // I got it
    .wait(1000)
    .visible('[class*=_box_]');
  t.false(completeFood);

  const completeFoodUsingInput = await nightmare
    .click('#food')
    .wait(1000)
    .click('[class*=_buttonList_] li:first-child a')
    .wait(1000)
    .click('[class*=_buttonList_] li:first-child a') // Meat
    .wait(1000)
    .click('[class*=_convenientList_] li:last-child a') // Other
    .click('[class*=_buttonList_] a') // Next
    .wait(1000)
    .type('[class*=_convenientInput_]', 'foo')
    .click('[class*=_buttonList_] a') // I got it
    .wait(1000)
    .click('[class*=_buttonList_] a') // I got it
    .wait(1000)
    .visible('[class*=_box_]');
  t.false(completeFoodUsingInput);
});
