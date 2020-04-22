const buildResponse = (res, httpCode, data, message) => {
  return res.status(httpCode).json({
    status: httpCode,
    data,
    message
  });
};

const stringRaw = function stringRaw(word) {
  let wordRaw = word;
  if (wordRaw !== null) {
    wordRaw = wordRaw.toLowerCase();
    wordRaw = wordRaw.replace(/[àáâãäå]/g, "a");
    wordRaw = wordRaw.replace(/[èéêë]/g, "e");
    wordRaw = wordRaw.replace(/[ìíîï]/g, "i");
    wordRaw = wordRaw.replace(/[òóôõö]/g, "o");
    wordRaw = wordRaw.replace(/[ùúûü]/g, "u");
    wordRaw = wordRaw.replace(/ñ/g, "n");
    wordRaw = wordRaw.replace(/ /g, "_");
    wordRaw = wordRaw.replace(/[%/-]/g, "");
    wordRaw = wordRaw.replace(/[\,\.\'\"\~\(\)\¿\'\?]/g, "");
  }
  return wordRaw;
};

module.exports = {
  buildResponse,
  stringRaw
};
