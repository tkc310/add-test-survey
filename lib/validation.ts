/**
 * フォームバリデーション用のユーティリティ関数
 * ユニットテストの対象となる純粋関数
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []

  if (!email) {
    errors.push('メールアドレスは必須です')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('有効なメールアドレスを入力してください')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * パスワードのバリデーション
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password) {
    errors.push('パスワードは必須です')
  } else if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります')
  } else if (!/[A-Z]/.test(password)) {
    errors.push('パスワードには大文字を含める必要があります')
  } else if (!/[0-9]/.test(password)) {
    errors.push('パスワードには数字を含める必要があります')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 名前のバリデーション
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = []

  if (!name) {
    errors.push('名前は必須です')
  } else if (name.length < 2) {
    errors.push('名前は2文字以上である必要があります')
  } else if (name.length > 50) {
    errors.push('名前は50文字以内である必要があります')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
