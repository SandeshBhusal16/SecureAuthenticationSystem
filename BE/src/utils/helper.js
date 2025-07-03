function GenerateRandomstring(length) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let filename = "";

  for (let i = 0; i < length; i++) {
    filename += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return filename;
}

module.exports = GenerateRandomstring;
