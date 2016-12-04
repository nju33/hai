import {SET_TALKS, STEP_TALK, ANSWER_TALK, DONE_TALK,
        RESET_TALKS, TOGGLE_CONVENIENT_ITEM, SET_EVENT} from './action';

const initialState = {
  __event: {},
  lastType: null,
  selected: [],
  currentIdx: null,
  old: null,
  active: null,
  talks: null,
  answers: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TALKS: {
      const {talks} = action;
      return Object.assign({}, state, {
        lastType: action.type,
        currentIdx: 0,
        active: talks[0],
        talks,
        answers: {}
      });
    }

    case STEP_TALK: {
      const {idx} = action;
      const nextIdx = state.currentIdx + idx;
      if (state.talks.length - 1 < nextIdx) {
        const m = 'Talk does not exist. Maybe it\'s a place to use `done`';
        throw new Error(m);
      }

      return Object.assign({}, state, {
        lastType: action.type,
        selected: [],
        currentIdx: nextIdx,
        old: state.active,
        active: state.talks[nextIdx]
      });
    }

    case ANSWER_TALK: {
      const {answer} = action;
      const nextState = Object.assign({}, state, {
        lastType: action.type
      });
      Object.assign(nextState.answers, answer);
      return nextState;
    }

    case DONE_TALK:
    case RESET_TALKS: {
      return Object.assign({}, state, initialState, {
        lastType: action.type
      });
    }

    case TOGGLE_CONVENIENT_ITEM: {
      const {convenientType, item} = action;
      const idx = state.selected.indexOf(item);
      const nextState = Object.assign({}, state, {
        lastType: action.type
      });

      if (convenientType === 'radio') {
        return Object.assign(nextState, {
          selected: [item]
        });
      } else if (convenientType === 'checkbox') {
        if (idx === -1) {
          return Object.assign(nextState, {
            selected: [...state.selected, item]
          });
        }
        nextState.selected.splice(idx, 1);
        return nextState;
      }
      break;
    }

    case SET_EVENT: {
      const {event} = action;
      const nextState = Object.assign({}, state, {
        lastType: action.type
      });
      Object.assign(nextState.__event, event);
      return nextState;
    }

    default: {
      return state;
    }
  }
};
