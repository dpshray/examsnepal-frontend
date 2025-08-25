import * as Yup from 'yup';


export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
});


export const registrationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
    phone: Yup
        .string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Phone number is not valid')
        .required('Phone number is required'),
    password: Yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    password_confirmation: Yup
        .string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
    exam_type: Yup.string()
        .required('Please select an exam type'),

});

export const forgotPasswordSchema = Yup.object().shape({
    email: Yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
})


export const QuestionSchema = Yup.object().shape({
    question: Yup
        .string()
        .required('Question is required'),
})