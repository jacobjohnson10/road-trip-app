require('module-alias/register')
const Router = require('express').Router;
const { check, validationResult } = require('express-validator');
const verify = require('@security').verifyToken;

/*
 * This endpoint adds a user's trip to the database
 */
module.exports = Router({mergeParams: true})
.post('/trip', [check('trip')], verify, async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {return res.status(422).json({ errors: errors.array() }) }
    const trip = req.body.trip;
    const user = await req.db.Users.findOne({'email': req.token.user.email});
	
    if(user){
    	user.trips.push(trip);
		const updated = await user.save();
		res.sendStatus(200)
    }else{
    	req.logger.info({error: "User not found."})
    	res.sendStatus(404)
    }
})