import { createHash } from 'node:crypto';

// Git and Studionet release hashes use LF source bytes. Normalize CRLF checkouts
// so Windows and Linux calculate the same source fingerprint.
export function sourceSha256(source) {
  const normalized = Buffer.isBuffer(source)
    ? Buffer.from(source.toString('utf8').replace(/\r\n/g, '\n'), 'utf8')
    : Buffer.from(String(source).replace(/\r\n/g, '\n'), 'utf8');
  return createHash('sha256').update(normalized).digest('hex');
}
