

export const encodeToBase64 = (content: string): string => {
  try {
    return btoa(new TextEncoder().encode(content).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  } catch (err) {
    console.error("Failed to encode Base64:", err);
    return content;
  }
};

export const decodeFromBase64 = (base64Content: string): string => {
  try {
    const bytes = atob(base64Content)
      .split('')
      .map(c => c.charCodeAt(0));
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch (err) {
    console.error("Failed to decode Base64:", err);
    return base64Content;
  }
};
