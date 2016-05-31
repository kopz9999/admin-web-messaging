export class User {
  constructor({id, layerId, displayName, color, avatarURL}) {
    this.id = id;
    this.layerId = layerId;
    this.displayName = displayName;
    this.color = color;
    this.avatarURL = avatarURL;
  }
}

export class UserFactory {
  buildFromAPI(opts) {
    return new User({
      id: opts.id,
      layerId: opts.content.layer_id,
      displayName: opts.content.display_name,
      color: opts.content.color,
      avatarURL: opts.content.avatar_url
    });
  }

  buildFromEvent(opts) {
    return new User({
      id: opts.id,
      layerId: opts.layer_id,
      displayName: opts.display_name,
      color: opts.color,
      avatarURL: opts.avatar_url
    });
  }

  // TODO: Update when needed
  buildFromMetadata(opts) {
    return new User({
      id: opts.id,
      layerId: opts.layerId,
      displayName: opts.displayName,
      color: '#a5b0bb',
      // avatarURL: opts.avatarURL
    });
  }
}

export const userFactoryInstance = new UserFactory();
