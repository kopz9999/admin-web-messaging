const initialState = {
  uniqueEvents: true,
};

export default function settingsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    default:
      return state;
  }
}
