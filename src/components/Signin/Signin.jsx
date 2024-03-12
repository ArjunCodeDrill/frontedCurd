import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
const signinSchema = yup.object({
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

const Signin = () => {
   const [cookie,setCookie]=useCookies(["auth"])
const navigateTo = useNavigate();
   const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password:""
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(signinSchema),
  });

  const onSubmit = async (values) => {

    const result = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/sign-in`,
      {
        email: values.email.toLowerCase(),
        password: values.password,
      }
    );
    if (result.data.status === 200) {
    setCookie("auth",result.data.data)
      toast.success(result.data.message);
      navigateTo("/product-list");
      
      reset();
      
    
    } else {
    
      toast.error(result.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: true })}
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
               <p className="text-sm text-red-600">
                {errors && errors?.email?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                 {...register("password", { required: true })}
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <p className="text-sm text-red-600">
                {errors && errors?.password?.message}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/sign-up"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Signup
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
