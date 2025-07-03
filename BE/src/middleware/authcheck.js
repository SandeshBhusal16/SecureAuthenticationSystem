const Authcheck = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers["authorization"]) {
      token = req.headers["authorization"];
    }
    if (!token) {
      throw "Token is not provided";
    }
    token = token.split(" ").pop();

    let response = await jwtToken.verify(token, process.env.JWT_KEY);
    let UserDetails = await usersrv.findUserById(response.id);
    console.log(UserDetails);

    if (UserDetails) {
      req.User = UserDetails;
      next();
    }

    token = token.split(" ").pop();
  } catch (error) {
    console.log(error);
  }
};
