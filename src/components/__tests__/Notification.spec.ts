import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Notification from '../Notification.vue'

type NotificationType = 'info' | 'success' | 'error'

const notification1 = {
  id: '123',
  title: 'Test Notification',
  description: 'This is a test notification.',
  namespace: 'app',
  type: 'info' as NotificationType,
  timestamp: Date.now(),
  read: false
}

const notification2 = {
  id: '1234',
  title: 'Test Notification',
  description: 'This is a test notification.',
  namespace: 'app',
  type: 'info' as NotificationType,
  timestamp: Date.now(),
  read: true
}

describe('notification', () => {

  const wrapper = mount(Notification, { props: { data: notification1 } })
  it('renders properly', () => {
    expect(wrapper.text()).toContain(notification1.title)
  })

  it('should render buttons when not marked as read', async () => {
    expect(wrapper.find('button .pi-eye').exists()).toBe(true);
    expect(wrapper.find('button .pi-check').exists()).toBe(false);
    expect(wrapper.find('button .pi-trash').exists()).toBe(true);
  })

  it('should render buttons when marked as read', async () => {
    wrapper.setProps({ data: { ...notification1, read: true } })
    await wrapper.vm.$forceUpdate()

    expect(wrapper.find('button .pi-eye').exists()).toBe(false)
    expect(wrapper.find('button .pi-check').exists()).toBe(true)
  })

  it('should apply correct css classes based on notification type', async () => {
    expect(wrapper.find(".bg-blue-200").classes()).toContain('text-blue-500')

    wrapper.setProps({ data: { ...notification1, type: 'success' } })
    await wrapper.vm.$forceUpdate()

    expect(wrapper.find(".bg-green-200").classes()).toContain('text-green-500')
  })
})
