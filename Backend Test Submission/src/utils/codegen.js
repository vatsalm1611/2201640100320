import crypto from "crypto";
const ABC = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function genCode(len = 6) { let s = ""; while (s.length < len) { s += ABC[crypto.randomBytes(1)[0] % ABC.length]; } return s; }
export function isAlnumCode(s) { return /^[A-Za-z0-9_-]{4,16}$/.test(s); }
