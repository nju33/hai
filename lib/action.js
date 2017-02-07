export const SET_TALKS = 'SET_TALKS';
export const STEP_TALK = 'STEP_TALK';
export const ADD_TALK = 'ADD_TALK';
export const SET_NEXT_TALK = 'SET_NEXT_TALK';
export const BACK_TALK = 'BACK_TALK';
export const FORWARD_TALK = 'FORWARD_TALK';
export const ANSWER_TALK = 'ANSWER_TALK';
export const DONE_TALK = 'DONE_TALK';
export const RESET_TALKS = 'RESET_TALKS';
export const TOGGLE_CONVENIENT_ITEM = 'TOGGLE_CONVENIENT_ITEM';
export const SET_EVENT = 'SET_EVENT';

export function setTalks(talks) {
  return {
    type: SET_TALKS,
    talks
  };
}

export function answerTalk({name, answer}) {
  return {
    type: ANSWER_TALK,
    name,
    answer
  };
}

export function addTalk(talk) {
  return {
    type: ADD_TALK,
    talk
  };
}

export function setNextTalk(talk) {
  return {
    type: SET_NEXT_TALK,
    talk
  };
}

export function backTalk() {
  return {
    type: BACK_TALK
  };
}

export function forwardTalk() {
  return {
    type: FORWARD_TALK
  };
}

export function doneTalk() {
  return {
    type: DONE_TALK
  };
}

export function resetTalks() {
  return {
    type: RESET_TALKS
  };
}

export function toggleConvenientItem(item, type) {
  return {
    type: TOGGLE_CONVENIENT_ITEM,
    convenientType: type,
    item
  };
}

export function setEvent(event) {
  return {
    type: SET_EVENT,
    event
  };
}
