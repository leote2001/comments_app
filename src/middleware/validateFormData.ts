import { Request, Response, NextFunction } from "express";
import { joiSchema } from "../utils/joi";
export const validateFormData = (formType: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let validationSchema;
        let userData;
        try {
            const formFields = req.body;
            if (formType === "login") {
                validationSchema = joiSchema("login");
                const {email, password} = formFields;
                userData = { email, password };
            } else {
                validationSchema = joiSchema("register");
                const {username, email, password, confirmPassword} = formFields;
                userData = { username, email, password, confirmPassword };
            }
            const { error } = validationSchema.validate(userData, { abortEarly: false });
            let errors: string[] = [];
            const oldData = formType === "login" ? {email: formFields.email} : {username: formFields.username, email: formFields.email};
            const view = formType === "login" ? "login" : "register";
            if (error) {
                console.log("entra en condicional de joi ")
                errors = error.details.map((err) => (
                    err.message
                ));
            }
            if (formFields.sum != formFields.result) {
                console.log("entra en condicional de suma");
                errors.push("Sum error");
            }
            if (errors.length > 0) {
                console.log("entra en condicional donde se renderiza")
                const num1 = Math.floor(Math.random() * (10 - 1 + 1) + 1);
                const num2 = Math.floor(Math.random() * (10 - 1 + 1) + 1);
                const result = num1 + num2;
                res.render(view, { errors, oldData, userData: {userId: (req as any).userId || null}, num1, num2, result });
                return;
            }
            next();
        } catch (err: any) {
            next(err);
        }
    }
}