const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition();

async function handler(event, context) {

  var rekognitionParams = {
    Image: {
      S3Object: {
        Bucket: process.env.BUCKET_NAME,
        Name: event['params']['querystring']['filename'],
      },
    },
    MaxLabels: 10,
    MinConfidence: 70,
  };

  console.log("RUNNING REKOGNITION");
  return new Promise((resolve, reject) => {
    return rekognition.detectLabels(rekognitionParams, async (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        console.log("DATA LABELS:", data.Labels);
        let hotdog = data.Labels.findIndex(val => val["Name"] === 'Hot Dog');
        let result = hotdog >= 0 ? true : false;
        return resolve(result);
      }
    });
  });
}

module.exports = { handler };
