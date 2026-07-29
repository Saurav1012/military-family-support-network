import jwt from "jsonwebtoken";

const socketAuth = (socket, next) => {

    try {

        const token = socket.handshake.auth.token;

        if (!token) {

            return next(new Error("Authentication Failed"));

        }

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        socket.user = decoded;

        next();

    }

    catch (err) {

        next(new Error("Invalid Token"));

    }

};

export default socketAuth;