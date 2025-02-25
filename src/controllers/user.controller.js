import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnClaudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    // get user details from frontend
    //validation - not empty
    //check if user already exists:username,email
    //check for images, check for avatar
    //upload them to claudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    const {fullname,email,username,password}=req.body
    console.log("email:",email)

    if(
        [fullname , email , username , password].some((field) => field?.trim() === "")
     ) {
            throw new ApiError(400,"All fields are required")
        }
    
     const existedUser =  User.findOne({
            $or: [{username} , {email}]
        })

    if(existedUser){
        throw new ApiError(409, "User with this username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnClaudinary(avatarLocalPath)
    const coverImage = await uploadOnClaudinary(coverImageLocalPath)
    

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
    
    const user = User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User could not be created")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User Registered Successfully ")
    )
    


})



export {registerUser}