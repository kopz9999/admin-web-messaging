const initialState = {
  uniqueEvents: true,
  bootstrapUsers: true,
  defaultLayerId: 'Customer Support',
  identityProviderURL: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
  headShotBaseURL: '//res.cloudinary.com/curaytor/image/upload/c_thumb,h_108,w_108',
};

export default function settingsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    default:
      return state;
  }
}
