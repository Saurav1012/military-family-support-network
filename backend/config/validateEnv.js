const requiredEnv = [

"PORT",

"MONGO_URI",

"JWT_SECRET",

"CLOUDINARY_CLOUD_NAME",

"CLOUDINARY_API_KEY",

"CLOUDINARY_API_SECRET"

];

requiredEnv.forEach((key)=>{

if(!process.env[key]){

throw new Error(

`Missing Environment Variable: ${key}`

);

}

});