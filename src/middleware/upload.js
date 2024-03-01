import multer from "multer";
import fs from "fs";


// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
export const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        let filename = "uploads/" + Date.now() + "-" + file.path;
        console.log(filename);
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    let fileNameArray = [];

    files.forEach((file) => {
      console.log(file.path);
      let filename = file.path;
      console.log(filename);
      fileNameArray.push(filename);
    });

    req.body.images = fileNameArray;

    // Attach files to the request object
    req.files = files;

    console.log(files);

    // Proceed to the next middleware or route handler
    next();
  });
};
// Custom file upload middleware for a single image
export const uploadMiddlewareCategory = (req, res, next) => {
    // Use multer upload instance for a single image
    upload.single("photo")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Retrieve uploaded file
      const file = req.file;
      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png","image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!allowedTypes.includes(file.mimetype)) {
        // Remove uploaded file
        let filename = "uploads/" + Date.now() + "-" + file.filename;
        console.log(filename);
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: `Invalid file type: ${file.originalname}` });
      }
  
      if (file.size > maxSize) {
        // Remove uploaded file
        let filename = "uploads/" + Date.now() + "-" + file.filename;
        console.log(filename);
        fs.unlinkSync(file.path);
        return res.status(400).json({ error: `File too large: ${file.originalname}` });
      }
  
      // Attach file to the request object
      req.file = file;  
      // Proceed to the next middleware or route handler
      next();
    });
  };

