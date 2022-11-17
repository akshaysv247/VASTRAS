const { response } = require('../app')
const {  error } = require('../models/joiShema');
const validation = require('../models/joiShema');
const errorFunction = require('../utils/errorFunction')

const userValidation = async (req) => {
	const data = {
		Name: req.body.Name,
		Email: req.body.Email,
		Password: req.body.Password,
		PhoneNumber: req.body.PhoneNumber,
		
		is_active: req.body.is_active,
	};

	const {error} = validation.validate(data)
   
	if (error) {
		
		return 
			errorFunction(true, `Error in User Data : ${error.message}`)
           
		
	} else {
		return true
	}
};


module.exports = userValidation;