import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateName } from './validation'

/**
 * バリデーション関数のユニットテスト
 * 
 * これらのテストは純粋関数をテストするため、最も高速で信頼性が高い
 * Testing Trophyの基盤となる層
 */

describe('validateEmail', () => {
  it('有効なメールアドレスを検証できる', () => {
    const result = validateEmail('test@example.com')
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('空のメールアドレスを拒否する', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('メールアドレスは必須です')
  })

  it('無効な形式のメールアドレスを拒否する', () => {
    const result = validateEmail('invalid-email')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('有効なメールアドレスを入力してください')
  })

  it('@マークのないメールアドレスを拒否する', () => {
    const result = validateEmail('testexample.com')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('有効なメールアドレスを入力してください')
  })
})

describe('validatePassword', () => {
  it('有効なパスワードを検証できる', () => {
    const result = validatePassword('Password123')
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('空のパスワードを拒否する', () => {
    const result = validatePassword('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('パスワードは必須です')
  })

  it('8文字未満のパスワードを拒否する', () => {
    const result = validatePassword('Pass1')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('パスワードは8文字以上である必要があります')
  })

  it('大文字を含まないパスワードを拒否する', () => {
    const result = validatePassword('password123')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('パスワードには大文字を含める必要があります')
  })

  it('数字を含まないパスワードを拒否する', () => {
    const result = validatePassword('Password')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('パスワードには数字を含める必要があります')
  })
})

describe('validateName', () => {
  it('有効な名前を検証できる', () => {
    const result = validateName('山田太郎')
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('空の名前を拒否する', () => {
    const result = validateName('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('名前は必須です')
  })

  it('2文字未満の名前を拒否する', () => {
    const result = validateName('山')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('名前は2文字以上である必要があります')
  })

  it('50文字を超える名前を拒否する', () => {
    const result = validateName('あ'.repeat(51))
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('名前は50文字以内である必要があります')
  })
})
