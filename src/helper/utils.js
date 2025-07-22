
import crypto from 'crypto';

export function generateKey() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashKey(key) {
    return crypto.createHash('sha256').update(key).digest('base64')
}