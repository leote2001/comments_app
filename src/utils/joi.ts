import Joi from "joi"
export const joiSchema = (formType: string) => {
    if (formType === "login") {
        return Joi.object({
            email: Joi.string().required().email().messages({
                "any.required": "Email is required",
                "string.email": "Not valid email",
                "string.empty": "You must provide an email"
            }),
            password: Joi.string().required().min(8).max(255).messages({
                "string.empty": "Please enter a password",
                "any.required": "Please enter a password",
                "string.min": "Password must be at least 8 characters long",
                "string.max": "Password must be at most 255 characters long"
            })
        });
    }
    return Joi.object({
        username: Joi.string().required().min(5).max(50).messages({
            "any.required": "Please enter a username",
            "string.empty": "Please enter a username",
            "string.min": "Username must be at least 5 characters long",
            "string.max": "Username must be at most 50 characters long"
        }),
        email: Joi.string().required().email().messages({
            "any.required": "Email is required",
            "string.email": "Not valid email",
            "string.empty": "You must provide an email"
        }),
        password: Joi.string().required().min(8).max(255).messages({
            "string.empty": "Please enter a password",
            "any.required": "Please enter a password",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must be at most 255 characters long"
        }),
        confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "string.empty": "Please enter a password",
    "any.required": "Please enter a password",
            "any.only": "Passwords don't match"
        })
    });
}