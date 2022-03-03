import { RefObject } from "react";
import { AnyAction } from "redux";
import {
	SET_CHAR,
	SET_WORD,
	TIMER_DECREMENT,
	TIMERID_SET,
	TIMER_SET,
	TIMER_RESET,
	APPEND_TYPED_HISTORY,
	PREV_WORD,
	SET_WORDLIST,
	SET_THEME,
	SET_TIME,
	SET_REF,
	SET_CARET_REF,
	SET_TYPE,
} from "./actions";

export interface State {
	theme: string;
	currWord: string;
	typedWord: string;
	timer: number;
	timerId: NodeJS.Timeout | null;
	timeLimit: number;
	wordList: string[];
	typedHistory: string[];
	type: string;
	activeWordRef: RefObject<HTMLDivElement> | null;
	caretRef: RefObject<HTMLSpanElement> | null;
}

export const initialState: State = {
	theme: "",
	currWord: "",
	typedWord: "",
	timer: 1,
	timerId: null,
	timeLimit: 0,
	wordList: [],
	typedHistory: [],
	type: "",
	activeWordRef: null,
	caretRef: null,
};

export const reducer = (state = initialState, { type, payload }: AnyAction) => {
	switch (type) {
		case TIMER_DECREMENT:
			return { ...state, timer: state.timer - 1 };
		case TIMER_SET:
			return { ...state, timer: payload };
		case TIMER_RESET: {
			return {
				...state,
				timer: state.timeLimit,
				typedWord: "",
				timerId: null,
				typedHistory: [],
			};
		}
		case TIMERID_SET:
			return { ...state, timerId: payload };
		case SET_CHAR:
			return { ...state, typedWord: payload };
		case SET_WORD:
			return { ...state, typedHistory: [...state.typedHistory, payload] };
		case APPEND_TYPED_HISTORY:
			const nextIdx = state.wordList.indexOf(state.currWord) + 1;
			return {
				...state,
				typedWord: "",
				currWord: state.wordList[nextIdx],
				typedHistory: [...state.typedHistory, state.typedWord],
			};
		case PREV_WORD:
			const prevIdx = state.wordList.indexOf(state.currWord) - 1;
			return {
				...state,
				currWord: state.wordList[prevIdx],
				typedWord: !payload ? state.typedHistory[prevIdx] : "",
				typedHistory: state.typedHistory.splice(
					0,
					state.typedHistory.length - 1
				),
			};
		case SET_WORDLIST: {
			const areNotWords = payload.every((word: string) =>
				word.includes(" ")
			);
			var shuffledWordList: string[] = payload.sort(
				() => Math.random() - 0.5
			);
			if (areNotWords)
				shuffledWordList = payload.flatMap((token: string) =>
					token.split(" ")
				);
			return {
				...state,
				currWord: shuffledWordList[0],
				wordList: shuffledWordList,
			};
		}
		case SET_THEME:
			return { ...state, theme: payload };
		case SET_TIME:
			return {
				...state,
				timer: payload,
				timeLimit: payload,
			};
		case SET_REF:
			return {
				...state,
				activeWordRef: payload,
			};
		case SET_CARET_REF:
			return {
				...state,
				caretRef: payload,
			};
		case SET_TYPE:
			return {
				...state,
				type: payload,
			};
		default:
			return state;
	}
};
