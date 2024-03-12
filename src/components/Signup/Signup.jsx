import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCookies } from "react-cookie";




const signUpSchema = yup.object({
  name: yup.string().required("Name is Required"),
  email: yup
    .string()
    .required("Email is Required")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid Email"
    ),
  password: yup
    .string()
    .min(8, "Password Must Be 8 Characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number and special characters "
    ),
});

const SignUp = () => {
   const [cookies, setCookie] = useCookies(['auth']);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/sign-up`,
      {
        name: values.name,
        email: values.email.toLowerCase(),
        password: values.password,
      }
    );
    if (result.status === 200) {
      console.log("df");
      toast.success(result.data.message);
      reset();
      setIsLoading(false);
      navigateTo("/");
    } else {
      setIsLoading(false);

      toast.error(result.data.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-[500px]">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Sign Up to Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
             {...register("name", { required: true })}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              
            />
            <p className="text-sm text-red-600">
                {errors && errors?.name?.message}
              </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
             {...register("email", { required: true })}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              
            />
            <p className="text-sm text-red-600">
                {errors && errors?.email?.message}
              </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
             {...register("password", { required: true })}
              className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
             
            />
             <p className="text-sm text-red-600">
                {errors && errors?.password?.message}
              </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <Link
                to="/"
                className="font-medium text-indigo-600 hover:text-indigo-500 "
              >
                Signin
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
