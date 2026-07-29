import Resource from "../models/Resource.js";

export const uploadResourceFiles=async(req,res)=>{

try{

const resource=await Resource.findById(req.params.id);

if(!resource){

return res.status(404).json({

success:false,

message:"Resource not found"

});

}

if(req.files.image){

resource.resourceImage=req.files.image[0].path;

}

if(req.files.pdf){

resource.resourcePdf=req.files.pdf[0].path;

}

await resource.save();

res.json({

success:true,

message:"Files Uploaded",

resource

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};