const knox = require("knox-s3");
let secrets;
const fs = require("fs");
if (process.env.NODE_ENV == "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("../secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
  key: secrets.AWS_KEY,
  secret: secrets.AWS_SECRET,
  bucket: "spiced-salt-image-board"
});

module.exports.upload = function(req, res, next) {
  if (!req.file) {
    return res.sendStatus(500);
  }

  const s3Request = client.put(req.file.filename, {
    "Content-Type": req.file.mimetype,
    "Content-Length": req.file.size,
    "x-amz-acl": "public-read"
  });

  const readStream = fs.createReadStream(req.file.path);
  readStream.pipe(s3Request);

  s3Request.on("response", s3Response => {
    const wasSuccessful = s3Response.statusCode == 200;
    if (wasSuccessful) {
      next();
    } else {
      // if upload was not successfull
      res.sendStatus(500);
      res.json({
        success: wasSuccessful
      });
    }
  });
};

module.exports.deleteImage = function deleteImage(url) {
  let fileName = url.replace(
    "https://s3.amazonaws.com/spiced-salt-image-board/",
    ""
  );
  console.log("fileName", fileName);
  client
    .del(fileName)
    .on("response", res => {
      console.log("status code", res.statusCode);
      console.log("header", res.headers);
    })
    .end();
};
