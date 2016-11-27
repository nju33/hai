export const SET_TALKS = 'SET_TALKS';
export const STEP_TALK = 'STEP_TALK';
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

export function stepTalk(idx = 1) {
  return {
    type: STEP_TALK,
    idx
  };
}

export function answerTalk(answer) {
  return {
    type: ANSWER_TALK,
    answer
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
