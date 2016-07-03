import expect from 'expect'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Visit from '../../../src/components/timeline/Visit'
import Avatar from '../../../src/components/timeline/Avatar'
import { User } from '../../../src/models/User'
import { Page } from '../../../src/models/Page'
import { Site } from '../../../src/models/Site'

function setup() {
  const testURL = 'https://cdn.meme.am/instances/66313256.jpg';
  const site = new Site({ 
      id: '3221', 
      title: '', 
      thumbnailURL: testURL
  });
  const props = {
    addTodo: expect.createSpy(),
    user: new User({ layerId: '123', displayName: 'testUser' }),
    page: new Page({ 
      id: '123', 
      displayName: 'testUser', 
      siteId: site.id, 
      thumbnailURL: testURL 
    }),
    receivedAt: Date.now(), 
    site
  };

  let renderer = TestUtils.createRenderer()
  renderer.render(<Visit {...props} />)
  let output = renderer.getRenderOutput()

  return {
    props,
    output,
    renderer
  }
}

describe('components', () => {
  describe('Visit', () => {
    it('should render correctly', () => {
      const { output } = setup()
      expect(output.type).toBe('div')
      
      let [ link ] = output.props.children;
      let avatar = link.props.children;
      
      expect(link.props.to).toBe("/users/123");
      expect(avatar.type).toBe(Avatar);
    })
  })
})
