const initialState = {
  uniqueEvents: true,
  bootstrapUsers: true,
  appId: 'layer:///apps/staging/52e7c9b4-e9cb-11e5-a188-7d4ed71366e8',
  defaultLayerId: 'Customer Support',
  identityProviderURL: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
};

export default function settingsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    default:
      return state;
  }
}
