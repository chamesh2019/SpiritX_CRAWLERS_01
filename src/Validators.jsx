import React, { useState } from 'react';

export const usernameValidator = (username) => {
    return username.length > 6;
}

export const passwordValidator = (password) => {
    return password.length > 8;
}

export const PasswordStrengthIndicator = (password) => {
    const getStrength = (password) => {
        let strength = 0;
        const criteria = {
            length: password.length > 6,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[^A-Za-z0-9]/.test(password)
        };

        if (criteria.length) strength += 1;
        if (criteria.uppercase) strength += 1;
        if (criteria.number) strength += 1;
        if (criteria.specialChar) strength += 1;

        return { strength, criteria };
    };

    const {strength, criteria} = getStrength(password);
    const strengthText = ["", "Weak", "Fair", "Good", "Strong"];

    return {strength, criteria, strengthText: strengthText[strength]};
};

export const confirmPasswordValidator = (password, confirmPassword) => {
    return password === confirmPassword;
}