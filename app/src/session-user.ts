let SESSION_USER:  {
    user: { key: '-NjTR6PAWb9wWcvJvrvQ', name: 'Iago', phone: '74988420307' },
    iat: 1700295442,
    exp: 1700299042
  }
export const EXPIRESIN = '1h';

export function setSessionUser(value: any) {
    SESSION_USER = value;
}

export function getSessionUser() {
    return SESSION_USER;
}

