import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Register.css";

const Register = () => {

  const navigate = useNavigate();

  const [loading,setLoading]=useState(false);

  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm();

  const onSubmit = async(data)=>{

    try{

      setLoading(true);

      const response = await registerUser(data);

      toast.success(response.message);

      navigate("/login");

    }catch(error){

      toast.error(
        error.response?.data?.message || "Registration Failed"
      );

    }finally{

      setLoading(false);

    }

  };

  return(

<div className="register-card">

<h2 className="register-title text-center">
Register
</h2>

<p className="text-center text-muted mb-4">
Military Family Support Network
</p>

<form onSubmit={handleSubmit(onSubmit)}>

<div className="row">

<div className="col-md-6 mb-3">

<input
className="form-control"
placeholder="Full Name"
{...register("name",{required:true})}
/>

{errors.name &&
<small className="text-danger">
Name is required
</small>
}

</div>

<div className="col-md-6 mb-3">

<input
type="email"
className="form-control"
placeholder="Email"
{...register("email",{required:true})}
/>

{errors.email &&
<small className="text-danger">
Email is required
</small>
}

</div>

<div className="col-md-6 mb-3">

<input
type="password"
className="form-control"
placeholder="Password"
{...register("password",{
required:true,
minLength:6
})}
/>

{errors.password &&
<small className="text-danger">
Minimum 6 characters
</small>
}

</div>

<div className="col-md-6 mb-3">

<select
className="form-select"
{...register("role",{required:true})}
>

<option value="">
Select Role
</option>

<option value="spouse">
Spouse
</option>

<option value="parent">
Parent
</option>

<option value="ngo">
NGO
</option>

</select>

</div>

<div className="col-md-6 mb-3">

<input
className="form-control"
placeholder="Relationship"
{...register("relationship",{required:true})}
/>

</div>

<div className="col-md-6 mb-3">

<input
className="form-control"
placeholder="Military ID"
{...register("militaryIdNumber",{required:true})}
/>

</div>

<div className="col-md-6 mb-3">

<input
className="form-control"
placeholder="City"
{...register("city",{required:true})}
/>

</div>

<div className="col-md-6 mb-3">

<input
className="form-control"
placeholder="State"
{...register("state",{required:true})}
/>

</div>

</div>

<button
className="btn btn-success w-100 btn-register"
disabled={loading}
>

{loading ? "Please Wait..." : "Register"}

</button>

<div className="text-center mt-3">

Already have an account?

<Link
to="/login"
className="ms-2"
>

Login

</Link>

</div>

</form>

</div>

  );

};

export default Register;