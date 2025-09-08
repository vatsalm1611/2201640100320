import crypto from "crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function genCode(len = 6) {
    let out = "";
    while (out.length < len) {
        const b = crypto.randomBytes(1)[0];
        out += ALPHABET[b % ALPHABET.length];
    }
    return out;
}

export function isAlnumCode(s) {
    return /^[A-Za-z0-9_-]{4,16}$/.test(s);
}
