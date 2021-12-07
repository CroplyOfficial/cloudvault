const splitNChars = (txt: string, num: number): string[] => {
  var result: string[] = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
};

export const minifyRSAPublicKey = (key: string) => {
  const rawData = key
    .split("-----BEGIN RSA PUBLIC KEY-----\n")[1]
    .split("-----END RSA PUBLIC KEY")[0]
    .split("\n");
  return rawData.join("");
};

export const convertToPrivatePEM = (minified: string) => {
  let rawData = splitNChars(minified, 64);
  if (!rawData) throw new Error("invalid key");
  const multilineBase64 = rawData.join("\n");
  return (
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    multilineBase64 +
    "\n-----END RSA PRIVATE KEY-----\n"
  );
};

export const minifyRSAPrivateKey = (key: string) => {
  const rawData = key
    .split("-----BEGIN RSA PRIVATE KEY-----\n")[1]
    .split("-----END RSA PRIVATE KEY")[0]
    .split("\n");
  return rawData.join("");
};

export const convertToPublicPEM = (minified: string) => {
  let rawData = splitNChars(minified, 64);
  if (!rawData) throw new Error("invalid key");
  const multilineBase64 = rawData.join("\n");
  return (
    "-----BEGIN RSA PUBLIC KEY-----\n" +
    multilineBase64 +
    "\n-----END RSA PUBLIC KEY-----\n"
  );
};
