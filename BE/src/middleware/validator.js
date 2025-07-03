const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      let data = req.body;

      let response = await schema.validateAsync(data, {
        abortEarly: false,
      });

      if (response.details) {
        throw response.details.message;
      }

      next();
    } catch (error) {
      next({
        data: "",
        msg: error,
        code: 401,
      });
    }
  };
};

module.exports = { bodyValidator };
