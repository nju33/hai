import {SET_TALKS, ANSWER_TALK, ADD_TALK, SET_NEXT_TALK, BACK_TALK,
        FORWARD_TALK, DONE_TALK, RESET_TALKS,
        TOGGLE_CONVENIENT_ITEM} from './action';

const initialState = {
  lastType: null,
  back: [],
  forward: [],
  currentIdx: null,
  old: null,
  active: null,
  talks: null,
  names: null,
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
        names: (() => {
          return talks.reduce((result, talk) => {
            result[talk.name] = talk.name;
            return result;
          }, {});
        })(),
        answers: {}
      });
    }

    case ANSWER_TALK: {
      const {name, answer} = action;
      const nextState = Object.assign({}, state, {
        lastType: action.type
      });
      Object.assign(nextState.answers, {[name]: answer});
      return nextState;
    }

    case ADD_TALK: {
      const {talk} = action;
      const nextState = Object.assign({}, state, {
        lastType: action.type
      });
      nextState.talks.unshift(talk);
      return nextState;
    }

    case SET_NEXT_TALK: {
      const {talk} = action;
      state.answers[talk.name] = null;
      return Object.assign({}, state, {
        lastType: action.type,
        back: [...state.back, state.active],
        forward: [],
        active: talk,
        answers: state.answers
      });
    }

    case BACK_TALK: {
      const talk = state.back.pop();
      return Object.assign({}, state, {
        lastType: action.type,
        back: state.back,
        forward: [...state.forward, state.active],
        active: talk
      });
    }

    case FORWARD_TALK: {
      const talk = state.forward.pop();
      return Object.assign({}, state, {
        lastType: action.type,
        back: [...state.back, state.active],
        forward: state.forward,
        active: talk
      });
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

    default: {
      return state;
    }
  }
};
