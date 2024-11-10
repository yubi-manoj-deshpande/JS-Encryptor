async function importPublicKey(pem) {
  const binaryDerString = window.atob(pem.split('\n').filter(line => line && !line.startsWith('-----')).join(''));
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

async function encryptMessage(publicKey, message) {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    encodedMessage
  );

  // Convert ArrayBuffer to Base64 for easy readability and transmission
  const encryptedArray = new Uint8Array(encrypted);
  return window.btoa(String.fromCharCode(...encryptedArray));
}

const pemPublicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv1B...
-----END PUBLIC KEY-----
`;

async function encryptStringWithPublicKey(message) {
  const publicKey = await importPublicKey(pemPublicKey);
  const encryptedMessage = await encryptMessage(publicKey, message);
  console.log("Encrypted Message:", encryptedMessage);
}

encryptStringWithPublicKey("Hello, World!");
