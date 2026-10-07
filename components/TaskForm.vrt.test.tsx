import { composeStories } from '@storybook/react'
import { page } from 'vitest/browser'
import { describe, expect, test } from 'vitest'

import * as stories from './TaskForm.stories'

const { Default, Filled, Focused, ValidationError, AfterSubmit, Submitting } =
  composeStories(stories)

/**
 * TaskForm ストーリーをソースにしたビジュアルリグレッション。
 * play 付きストーリーは run() で入力状態を再現してから撮影する。
 */
describe('TaskForm VRT', () => {
  test('Default', async () => {
    await Default.run()
    await expect(page.getByLabelText('新しいタスク')).toMatchScreenshot(
      'task-form-default'
    )
  })

  test('Filled', async () => {
    await Filled.run()
    await expect(page.getByLabelText('新しいタスク')).toMatchScreenshot(
      'task-form-filled'
    )
  })

  test('Focused', async () => {
    await Focused.run()
    await expect(page.getByLabelText('新しいタスク')).toMatchScreenshot(
      'task-form-focused'
    )
  })

  test('ValidationError', async () => {
    await ValidationError.run()
    await expect(page.getByRole('alert')).toMatchScreenshot(
      'task-form-validation-error'
    )
  })

  test('AfterSubmit', async () => {
    await AfterSubmit.run()
    await expect(page.getByLabelText('新しいタスク')).toMatchScreenshot(
      'task-form-after-submit'
    )
  })

  test('Submitting', async () => {
    await Submitting.run()
    await expect(page.getByRole('button', { name: '追加中...' })).toMatchScreenshot(
      'task-form-submitting'
    )
  })
})
