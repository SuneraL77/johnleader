import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const subSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim:true,
      required: [true, "Please Provide name"],

    },
  slug:{
    type:String,
    uinique:true,
    lowercase:true,
    index:true
  },
  image:{
    filename:String,
    path:String,
  },
  parent:{type:ObjectId,ref:"Category",required:true}
  },
  {
    colection: "subs",
    timeStamps: true,
  }
);

const SubModel =
  mongoose.models.SubModel || mongoose.model("SubModel", subSchema);

export default SubModel;
