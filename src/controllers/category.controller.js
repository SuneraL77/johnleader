import { categoriesRead, createCategory1 , categoryRead, categoryUpdate ,categoryImg,deleteCategory} from "../services/category.service.js"
import path from "path";

export const createCategory = async(req,res,next) => {
try {
    const {filename,path} = req.file;

    const {name} = req.body
    const category = await createCategory1({name,path, filename});
    
    res.json(category)
} catch (error) {
    next(error)
}
}

export const listCategory = async (req,res,next) =>{
    try {
        const category = await categoriesRead();
        res.json(category)

    } catch (error) {
        next(error)
    }
}

export const readOneCategory = async (req,res,next) =>{
    try {
        const readone = await categoryRead(req.params.slug);
        res.json(readone)
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req,res,next) =>{
    try {
        const {name} =req.body
        const {filename,path} = req.file
        const slug = req.params.slug
        const update = await categoryUpdate({name, slug, filename, path});
     
        res.json(update)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const viewCategoryImgs = async (req,res,next) =>{
    try {
        const  photo = await categoryImg(req.params.slug);
           // Get the directory path using import.meta.url
    const currentModulePath = new URL(import.meta.url).pathname;
    const directoryPath = path.dirname(currentModulePath);

    // Construct the absolute path to the profile picture
    const picAbsolutePath = path.join(directoryPath, "../uploads", photo.filename)

    console.log("File Path:", picAbsolutePath);

    res.sendFile(picAbsolutePath);
    } catch (error) {
    console.log(error)
        next(error)
    }

}

export const categorydelete  = async (req,res,next) =>{
    try {
        const deletedCategory = await deleteCategory(req.params.slug)
        res.json(deleteCategory)
    } catch (error) {
        next(error)
    }
 
}