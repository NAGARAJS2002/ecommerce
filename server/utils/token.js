import {COOKIE_EXPIRES_TIME }from "../config/index.js"
export const sendToken = (user, statusCode, res) => { 
        const token = user.getJwtToken();

        const options = {
            expires: new Date(
                Date.now() + COOKIE_EXPIRES_TIME  * 24 * 60 * 60 * 1000 
            ),
            httpOnly: true
        }

        res.status(statusCode).
        cookie('access_token',token , options).json({
            success: true,
            token,
            user
        })
}