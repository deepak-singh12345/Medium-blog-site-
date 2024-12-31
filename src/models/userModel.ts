import mongoose , {Schema, Document} from 'mongoose';

interface IUser extends Document { // define the shape of object
    firstName: string;
    lastName:string;
    userName:string;
    password:string;
    email:string;
    verified:boolean;
    blogsCount:number;
    role:'user'|'admin';
    profilePic?:string;
    deleted:boolean;
    deletedAt?:Date;
    deletedBy?:string;
    createdAt: Date;
    updatedAt:Date;
}


const userSchema: Schema<IUser> = new Schema(
    {
      firstName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/, // Regex for letters only
      },
      lastName: {
        type: String,
        required: true,
        match: /^[A-Za-z]+$/, // Regex for letters only
      },
      userName: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 20,
        match: /^(?=.*[!@#$%^&*])(?=.*[0-9])[A-Za-z0-9!@#$%^&*]{8,20}$/, // Regex for at least one special char and number
      },
      password:{
        type:String,
        required:true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
      },
      verified: {
        type: Boolean,
        default: true,
      },
      blogsCount: {
        type: Number,
        required: true,
        default: 0,
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
      },
      profilePic: {
        type: String, // Store the URL of the profile picture
        default: null, // Optional
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null, // Optional
      },
      deletedBy: {
        type: String,
        default: null, // Optional
      },
    },
    {
      timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
  );

  // Create and export the User model
  const User = mongoose.model<IUser>('User', userSchema);

  export default User;
