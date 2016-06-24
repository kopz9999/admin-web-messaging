export class User {
  constructor({id, layerId, displayName, color, iconIdentity, avatarURL}) {
    this.id = id;
    this.layerId = layerId;
    this.displayName = displayName;
    this.color = color;
    this.iconIdentity = iconIdentity;
    this.avatarURL = avatarURL;
  }
}

export class UserFactory {
  serializeToAlgolia(user) {
    return {
      id: user.id,
      avatar_url: user.avatarURL,
      layer_id: user.layerId,
      display_name: user.displayName,
      icon_identity: user.iconIdentity,
      color: user.color,
    };
  }

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
      avatarURL: opts.avatar_url,
      iconIdentity: opts.icon_identity || '0',
    });
  }

  buildFromAlgolia(opts) {
    return new User({
      id: opts.id,
      objectId: opts.objectID,
      layerId: opts.layer_id,
      displayName: opts.display_name,
      color: opts.color,
      iconIdentity: opts.icon_identity,
    });
  }

  buildUnknownUser(opts) {
    return new User({
      id: opts.layerId,
      layerId: opts.layerId,
      displayName: 'Unknown',
      color: '#a5b0bb',
      iconIdentity: '0',
      avatarURL: null
    });
  }

  // TODO: Update when needed
  buildFromMetadata(opts) {
    return new User({
      id: opts.id,
      layerId: opts.layerId,
      displayName: opts.displayName,
      color: '#a5b0bb',
      iconIdentity: opts.iconIdentity || '0',
      avatarURL: opts.avatarURL
    });
  }

  buildFromBaseAPI(opts, settings) {
    const headShotId = opts.headshot;
    const avatarURL = headShotId ?
      `${settings.headShotBaseURL}/${headShotId}` : null;
    return new User({
      id: opts.id,
      layerId: opts.id.toString(),
      displayName: opts.name,
      color: '#a5b0bb',
      avatarURL,
    });
  }

  serializeToJSON(userInstance) {
    let obj = {}, prop;
    Object.keys(userInstance).forEach(k => {
      if (prop = userInstance[k]) {
        obj[k] = prop.toString();
      }
    });
    return obj;
  }
}

export const userFactoryInstance = new UserFactory();
