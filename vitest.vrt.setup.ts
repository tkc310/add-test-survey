import { setProjectAnnotations } from '@storybook/react'
import { beforeAll } from 'vitest'

// Storybook preview と同じグローバル CSS を適用する
import './app/globals.css'
import * as previewAnnotations from './.storybook/preview'

const annotations = setProjectAnnotations([previewAnnotations])

beforeAll(annotations.beforeAll)
