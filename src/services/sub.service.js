import createHttpError from "http-errors";
import { ProductModel, SubModel } from "../models/index.js";
import slugify from "slugify";
import fs from "fs/promises";

export const createSub = async (subData) => {
  const { name, parent, path, file } = subData;
  if (!name || !parent || !path || !file) {
    try {
      await fs.unlink(path);
    } catch (unlinkError) {
      throw createHttpError.BadRequest(unlinkError);
    }
    throw createHttpError.BadRequest("All fields required");
  }
  const sub = await SubModel({
    name,
    slug: slugify(name),
    image: { filename: file, path: path },
    parent,
  });
  return sub;
};

export const listSub = async () => {
  const subs = await SubModel.find({}).sort({ createdAt: -1 });
  return subs;
};

export const readSub = async (slug) => {
  let sub = await SubModel.findOne({ slug: slug });
  const products = await ProductModel.find({ subs: sub }).populate("category");
  return { sub, products };
};

export const updateSub = async (subData) => {
    const { slug, name, parent, path, file } = subData;
    
    try {
      let updateFields = { name,slug:slugify(name), parent };
      if (file && file.length > 0) {
        updateFields.image = {
          filename: file[0].filename,
          path: path,
        };
      }
      
      const updatedSub = await SubModel.findOneAndUpdate({ slug }, updateFields, {
        new: true, // Return the updated document
        runValidators: true, // Run model validations
      });
      
      return updatedSub;
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  };

export const deleteSub = async (slug) =>{
    const sub = await SubModel.findOne({slug:slug});
    if(!sub){
        createHttpError.BadRequest("can't find sub")
    }
    await fs.unlink(sub.image.path)

    const deleted = await SubModel.deleteOne({slug:slug})
    return deleted
}




{
  /*Sub Not Image */
}

// export const createSub = async (subData) =>{
//     const {name,parent}= subData
//     if(!name||!parent){
//         throw createHttpError.BadRequest('name is parent required')
//     }
//     const sub = new SubModel({name,slug:slugify(name)},parent).save();
//     return sub
// }



//   export const updateSub = async (subData) => {
//     const { slug, name, parent } = subData;
    
  
//       let updateFields = { name, parent, slug };
  
//       const updatedSub = await SubModel.findOneAndUpdate({ slug }, updateFields, {
//         new: true, // Return the updated document
//         runValidators: true, // Run model validations
//       });
      
//       return updatedSub;

//   }

// export const deleteSub = async (slug) =>{

//     const deleted = await SubModel.deleteOne({slug:slug})
//     return deleted
// }
