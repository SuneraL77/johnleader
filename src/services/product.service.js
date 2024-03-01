import createHttpError from "http-errors";
import { ProductModel, UserModel } from "../models/index.js";
import fs from "fs/promises";
import slugify from "slugify";


export const createProduct = async (ProductData) => {
  const {
      title,
      prices,
      description,
      category,
      quantity,
      images,
      gender
  } = ProductData;
  if (
      !title ||
      !prices ||
      !description ||
      !category ||
      !quantity ||
      !images
      ||!gender
      
  ) {
      images.forEach(async (file) => {
          try {
              await fs.unlink(file.path);
          } catch (error) {
              console.log(error);
          }
      });
      throw createHttpError.BadRequest("All fields required");
  }

  const product = new ProductModel({
      title,
      slug: slugify(title),
      description,
      quantity,
      prices,
      category,
      quantity,
      images,
      color,
      gender
  });
  await product.save();
  return product;
};

export const image = async (slugData) => {
  const { slug } = slugData;
  const product = await ProductModel.findOne({ slug });
  //
  if (!product) {
    throw createHttpError.BadRequest("can't find Product");
  }
  // Check if there are any photos
  if (!product.images || product.images.length === 0) {
    return res.json({ error: "No images found for this product" });
  }
  const images1 = product.images;
  return images1;
};

export const removeProduct = async (slug) => {
  const product = await ProductModel.findOne({ slug: slug });

  // Get the paths of the images to be deleted

  const imagePaths = ProductModel.images.map((img) => img.path);

  // Remove the images from the uploads folder
  await Promise.all(imagePaths.map((path) => fs.unlink(path)));

  // Clear the images array in the room
  product.images = [];
  await ProductModel.findByIdAndDelete(product._id);
  return { message: "Deleted Successfully" };
};

export const list = async (listData) => {
  const { sort, order, page } = listData;
  const currentPage = page || 1;
  const perpage = (page = 3);

  const products = await ProductModel.find({})
    .skip((currentPage - 1) * perpage)
    .populate("category")
    .populate("subs")
    .sort([[sort, order]])
    .limit(perpage);

  return products;
};

export const listAllCount = async (count) => {
  let products = await ProductModel.find({})
    .limit(parseInt(count))
    .populate("category")
    .sort([["creatAt", "desc"]]);

  return products;
};

export const productCount = async () => {
  let total = await ProductModel.find({}).estimatedDocumentCount();
  return total;
};
// add rating star
export const productStar = async (starData) => {
  const { star, comment, userId, productId } = starData;
  const product = await ProductModel.findById(productId);
  const user = await UserModel.findOne({ _id: userId });

  // if user haven't left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await ProductModel.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id, comment } },
      },
      { new: true }
    ).exec();

    return ratingAdded;
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await ProductModel.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    return ratingUpdated;
  }
};

export const listRelated = async (productId) => {
  const product = await ProductModel.findById(productId);

  const related = await ProductModel.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs");

  return related;
}
export const updateProduct = async (productId, updatedData) => {
  const {
      title,
      prices,
      description,
      category,
      quantity,
      images,
      color,
      brand,
  } = updatedData;

  // Check if all required fields are provided
  if (
      !title ||
      !prices ||
      !description ||
      !category ||
      !quantity ||
      !images
  ) {
      throw createHttpError.BadRequest("All fields required");
  }

  // Find the existing product by its ID
  let product = await ProductModel.findById(productId);

  if (!product) {
      throw createHttpError.NotFound("Product not found");
  }

  // Update the product's properties
  product.title = title;
  product.slug = slugify(title);
  product.description = description;
  product.quantity = quantity;
  product.prices = prices;
  product.category = category;
  product.images = images;
  product.color = color;
  product.brand = brand;

  // Save the updated product
  await product.save();
  return product;
};

const handleCategory = async (category) =>{
  let products = await ProductModel.find({ category })
      .populate("category", "_id name")

   return products
}
const handelPrice = async (price) => {
  let products = await ProductModel.find({
    price: {
      $gte: price[0],
      $lte: price[1],
    },
  })
    .populate("category", "_id name")


  return products;
};
const handleQuery = async (query) =>{
  const products = await ProductModel.find({$text :{$search:query}})
  .populate("category","_id name")

  return products
}
const handleStar = async (stars) => {
  const aggregates = await ProductModel.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ]).limit(12);
  const productIds = aggregates.map((agg) => agg.document._id);

  const products = await ProductModel.find({ _id: { $in: productIds } })
    .populate("category", "_id name")
   

  return products;
};
const handleColor = async (color) => {
  const products = await ProductModel.find({ color })
    .populate("category", "_id name")
  return products;
};

export const searchFilters = async (searchData) =>{
const {query,price ,category,stars,color,brand} = searchData

if (query) {
  console.log("query ---->", query);
  await handleQuery(query);
}
if (price) {
  console.log("query ---->", price);
  await handelPrice( price);
}
if (category) {
  console.log("category -->", category);
  await handleCategory(category);
}
if (stars) {
  console.log("starts -->",stars);
  await handleStar( stars);
}


if (color) {
  console.log("color ---> ", color);
  await handleColor( color);
}

}