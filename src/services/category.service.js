import createHttpError from "http-errors";
import { CategoryModel, SubModel, ProductModel } from "../models/index.js";
import slugify from "slugify";
import fs from "fs/promises";

export const createCategory1 = async (categoryData) => {
  const { name, path, filename } = categoryData;

  if (!name || !path || !filename) {
    try {
      await fs.unlink(path);
    } catch (unlinkError) {
      throw createHttpError.BadRequest(unlinkError);
    }

    throw createHttpError.BadRequest("image and name not found category data");
  }
  const checkDb = await CategoryModel.findOne({ slug: slugify(name) });
  if (checkDb) {
    throw createHttpError.BadRequest("This category is alradey added");
  }

  const category = new CategoryModel({
    name,
    slug: slugify(name),
    image: {
      filename: filename,
      path: path,
    },
  }).save();
  return category;
}
export const categorisRead = async () => {
  const categories = await CategoryModel.find({}).sort({ createdAt: -1 });
  return categories;
}
export const categoryRead = async (slug) => {
  const category = await CategoryModel.findOne({ slug: slug });
  const products = await ProductModel.find({ category }).populate("category");
  return { category, products };
}
export const categoryUpdate = async (categoryData) => {
  const { name, slug, filename, path } = categoryData;
  const checkDb = await CategoryModel.findOne({ slug });
  if (!checkDb) {
    try {
      await fs.unlink(path);
    } catch (unlinkError) {
      throw createHttpError.BadRequest(unlinkError);
    }
    throw createHttpError.BadRequest("slug not defin");
  }

  if (!name) {
    try {
      await fs.unlink(path);
    } catch (unlinkError) {
      throw createHttpError.BadRequest(unlinkError);
    }

    throw createHttpError.BadRequest("all field are required");
  }
  if (filename.length > 0 || path.length > 0) {
    try {
      await fs.unlink(checkDb.image.path);
    } catch (unlinkError) {
      throw createHttpError.BadRequest(unlinkError);
    }
    const update = await CategoryModel.findOneAndUpdate(
      { slug: slug },
      {
        name: name,
        slug: slugify(name),
        "image.filename": filename,
        "image.path": path,
      },
      { new: true }
    );

    return update;
  }

  const update = await CategoryModel.findOneAndUpdate(
    { slug: slug },
    {
      name,
      slug: slugify(slug),
    },
    { new: true }
  );

  return update;
}
export const ctegoryImg = async (slug) => {
  const viewImg = await CategoryModel.findOne({ slug });
  return viewImg.image;
}

{
  /*Not image category */
}

// export const  categoryUpdate  = async(categoryData) =>{
// const {name , slug} = categoryData
// const updateCateory = await CategoryModel.findOneAndUpdate(
//     { slug: slug },
//     {
//       name,
//       slug: slugify(slug),
//     },
//     { new: true }
//   );
//   return updateCateory
// }

// export const createCategory = async (name) =>{
//     if(!name){
//         throw  createHttpError.BadRequest('name is required')
//     }
//     const category = new CategoryModel({
//         name,
//         slug:slugify(name)
//     }).save();
//     return category
// }
