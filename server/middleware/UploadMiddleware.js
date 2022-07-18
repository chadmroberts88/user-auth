const multer = require('multer');

const upload = multer({

  limits: {
    fileSize: 2000000
  },

  fileFilter: (req, file, cb) => {

    const mimeTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
    ]

    if (mimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error('File type not accepted.'));
    }

  }
});

module.exports = upload;