import mongoose, {Document, Schema} from 'mongoose';

interface IBlog extends Document{
    title:string;
    content:string;
    image?:string;
    createdBy:mongoose.Types.ObjectId;
    published:boolean;
    deleted:boolean;
    deletedAt?:Date;
    deletedBy?:mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt:Date;
}

const blogSchema: Schema<IBlog> = new Schema(
    {
      title: {
        type: String,
        required: true,
        unique:true,
        minlength: 5,
        maxlength: 128,
      },
      content: {
        type: String,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      published: {
        type: Boolean,
        default: false,
      },
      deleted: {
        type: Boolean,
        default: false,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  // Create and export the Blog model
  const Blog = mongoose.model<IBlog>('Blog', blogSchema);

  export default Blog;
