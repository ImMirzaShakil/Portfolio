import {
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export const PROJECT_UNLOCK_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const COOKIE_PREFIX = "project-unlock-";

function getSecret() {
  const secret =
    process.env.PROJECT_PASSWORD_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error("Missing PROJECT_PASSWORD_SECRET environment variable.");
  }

  return secret;
}

export function getProjectUnlockCookieName(slug: string) {
  return `${COOKIE_PREFIX}${slug}`;
}

export async function hashProjectPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyProjectPassword(password: string, hash: string) {
  const [salt, key] = hash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");

  if (derived.length !== keyBuffer.length) {
    return false;
  }

  return timingSafeEqual(derived, keyBuffer);
}

export function createUnlockToken(slug: string) {
  const exp = Date.now() + PROJECT_UNLOCK_MAX_AGE_SECONDS * 1000;
  const payload = `${slug}:${exp}`;
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");

  return `${exp}.${signature}`;
}

export function verifyUnlockToken(slug: string, token: string | undefined) {
  if (!token) {
    return false;
  }

  const [expValue, signature] = token.split(".");

  if (!expValue || !signature) {
    return false;
  }

  const exp = Number(expValue);

  if (Number.isNaN(exp) || Date.now() > exp) {
    return false;
  }

  const expected = createHmac("sha256", getSecret())
    .update(`${slug}:${exp}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function hasProjectUnlockAccess(
  slug: string,
  cookieValue: string | undefined
) {
  return verifyUnlockToken(slug, cookieValue);
}
