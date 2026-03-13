
export const PasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword
}

export const PasswordStrength = (password: string) => {
    if (password.length < 8) {
        return 'Weak'
    }
    if (password.length < 12) {
        return 'Medium'
    }
    return 'Strong'
}