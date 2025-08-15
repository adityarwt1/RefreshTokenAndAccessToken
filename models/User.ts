import mongoose ,{Schema , Document, mongo} from "mongoose"
import jsonwebtoken from "jsonwebtoken"

interface User extends Document{
    email: string
    password: string
}

const UserSchema : Schema<User> = new Schema({
    email: {
        type: String,
        required:[true , "Please provide the eamil id"]
    },
    password:{
        type:String,
        required:[true , "Please provide the password"]
    }
},{
    timestamps: true
})

///access token
UserSchema.methods.generateAccessToken = ()=>{

}

const User = mongoose.models.User || mongoose.model<User>("User" , UserSchema)
export default User