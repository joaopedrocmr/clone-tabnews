import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

function onNoMatchHandler(req, res) {
  const publicErrorObject = new MethodNotAllowedError({});
  res.status(405).json(publicErrorObject);
}

function onErrorHandler(err, req, res) {
  const publicErrorObject = new InternalServerError({
    statusCode: err.statusCode,
    cause: err,
  });

  console.error(publicErrorObject);

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
