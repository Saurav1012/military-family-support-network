import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./Login.css";

const Login = () => {

const navigate=useNavigate();

const {login}=useContext(AuthContext);

const [showPassword,setShowPassword]=useState(false);

const [loading,setLoading]=useState(false);

const {

register,

handleSubmit,

formState:{errors}

}=useForm();

const onSubmit=async(data)=>{

try{

setLoading(true);

const response=await loginUser(data);

login(response.user,response.token);

toast.success(response.message);

navigate("/dashboard");

}

catch(error){

toast.error(

error.response?.data?.message||

"Login Failed"

);

}

finally{

setLoading(false);

}

};

return(

<div className="login-card">

<h2 className="login-title text-center">

Login

</h2>

<p className="text-center text-muted mb-4">

Military Family Support

</p>

<form onSubmit={handleSubmit(onSubmit)}>

<div className="mb-3">

<label>Email</label>

<input

type="email"

className="form-control"

{

...register("email",{

required:true

})

}

/>

{

errors.email&&

<small className="text-danger">

Email Required

</small>

}

</div>

<div className="mb-4">

<label>Password</label>

<div className="input-group">

<input

type={showPassword?"text":"password"}

className="form-control"

{

...register("password",{

required:true

})

}

/>

<button

type="button"

className="btn btn-outline-secondary"

onClick={()=>setShowPassword(!showPassword)}

>

{

showPassword?

<FaEyeSlash/>:

<FaEye/>

}

</button>

</div>

{

errors.password&&

<small className="text-danger">

Password Required

</small>

}

</div>

<button

className="btn btn-primary w-100 btn-login"

disabled={loading}

>

{

loading?

"Please Wait..."

:

"Login"

}

</button>

</form>

</div>

);

};

export default Login;