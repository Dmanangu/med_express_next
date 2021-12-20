const getError = (err) =>
  err.respone && err.respone.data && err.response.data.message
    ? err.respone.data.message
    : err.message;

const onError = async (err, req, res, next) => {
  //await db.disconnect(); //should be converted into firebase firestore
  res.status(500).send({ message: err.toString() });
};
export { getError, onError };
