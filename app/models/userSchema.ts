import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is a mandatory field!"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is a mandatory field!"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is a mandatory field!"],
    },
    verifyOtp:{
        type:Number,
        required:true
    },
    verifyOtpExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

 const USER=mongoose.models.USER || mongoose.model('USER',userSchema)
 export default USER;