import mongoose from "mongoose";


const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim:true,
      required: [true, "Please Providename"],
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
  }
  },
  {
    colection: "categories",
    timeStamps: true,
  }
);

const CategoryModel =
  mongoose.models.CategoryModel || mongoose.model("CategoryModel", categorySchema);

export default CategoryModel;
