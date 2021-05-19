import { useReducer, useEffect } from "react";
import { database } from "../services/firebase";

const ACTIONS = {
  SELECT_GIF: "SELECT_GIF",
  FETCH_GIFS_BY_CATEGORY: "FETCH_GIFS_BY_CATEGORY",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_GIF:
      return {
        gifId: payload.gifId,
        gif: payload.gif,
      };
    case ACTIONS.FETCH_GIFS_BY_CATEGORY:
      return {
        ...state,
        gifsListByCategory: payload.gifsListByCategory,
      };
    default:
      return state;
  }
}

export function useGif(category = null, gifId = null, gif = null) {
  const [state, dispatch] = useReducer(reducer, {
    gifId,
    gif,
    category,
    gifsListByCategory: [],
  });

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_GIF, payload: { gifId, gif } });
  }, [gifId, gif]);

  useEffect(() => {
    return database.gifs
      .where("category", "==", category)
      .onSnapshot((snapshot) => {
        dispatch({
          type: ACTIONS.FETCH_GIFS_BY_CATEGORY,
          payload: {
            gifsListByCategory: snapshot.docs.map(database.formatDoc),
          },
        });
      });
  }, [category]);

  return state;
}
