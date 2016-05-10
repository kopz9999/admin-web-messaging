import React, { Component } from 'react';
import TimeLine from '../../components/timeline/TimeLine';
import Visit from '../../components/timeline/Visit';
import Message from '../../components/timeline/Message';

export default class Website extends Component {
  static getVisitData() {
    return [
      {
        user: {
          displayName: 'Margaret',
          avatarURL: 'https://s3-us-west-2.amazonaws.com/kopz-projects/Curaytor/Messenger/admin-avatar.png'
        },
        page: {
          title: '13 Robertson Ct'
        },
        receivedAt: new Date()
      },
      {
        user: {
          displayName: 'Igor',
          avatarURL: null
        },
        page: {
          title: '32 E Coleman Ave'
        },
        receivedAt: new Date()
      }
    ]
  }

  static getMessageData() {
    return [
      {
        user: {
          displayName: 'Margaret',
          avatarURL: 'https://s3-us-west-2.amazonaws.com/kopz-projects/Curaytor/Messenger/admin-avatar.png'
        },
        page: {
          title: '13 Robertson Ct'
        },
        message: {
          body: "Hi Margaret,\nI'm interested in buying property in Washington DC. I will add some dummy text to show how post with 3-4 rows look like. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat..."
        },
        receivedAt: new Date()
      },
      {
        user: {
          displayName: 'Simmone',
          avatarURL: null
        },
        page: {
          title: '55 Stone Run Rd'
        },
        message: {
          body: "Hi Margaret,\nI'm interested in buying property in Washington DC. I will add some dummy text to show how post with 3-4 rows look like. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat..."
        },
        receivedAt: new Date()
      }
    ]
  }

  renderVisits() {
    let visits = Website.getVisitData();
    return visits.map((element, index)=> {
      return (
        <Visit
          {
            ...({
              ...element,
              key: index
            })
          }
        />
      )
    });
  }

  renderMessages() {
    let messages = Website.getMessageData();
    return messages.map((element, index)=> {
      return (
        <Message
          {
            ...({
              ...element,
              key: index
            })
          }
        />
      )
    });
  }

  render() {
    return (
      <TimeLine>
        { this.renderVisits() }
        { this.renderMessages() }
      </TimeLine>
    );
  }
}
