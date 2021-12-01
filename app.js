import mergeImages from "merge-images-v2";
import * as fs from "fs";
import Canvas from "canvas";
import dotenv from "dotenv";

dotenv.config();

const imagesPath = "./images";
const dnaArray = [];
let uniqueAttempt = 0;

let folders = []; // ["folder1", "folder2", "folder3"]
let attributes = []; //[["f1t1", "f1t2"],["f2t1", "f2t2"], ["f3t1", "f3t2", "f3t3"]]

// Get path for all folders with images folder
function getFolders() {
  try {
    fs.readdirSync(imagesPath).forEach((folder) => {
      //console.log("folder: ", folder);
      if (folder == ".DS_Store" || folder == "Results") {
        return;
      } else {
        folders.push(`./images/${folder}/`);
        //console.log(folders);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// Get all the file paths within a specific folder and build and array (Attributes)
// with an array for each attribute folder.
function getFiles() {
  let contents = [];
  folders.forEach((folder) => {
    attributes.push(fs.readdirSync(`${folder}/`));
  });
}

// Get a random integer between 0 and a given max.
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getImageDNA(fileName) {
  let dnaStrand = fileName.split("_")[0];
  return dnaStrand;
}

// Will build an array with all images paths needed to build random image
function buildImgObject() {
  let imgageObject = {
    imageDNA: "",
    imageArray: [],
  };
  folders.forEach((folder, index) => {
    let currentFile = attributes[index][getRandomInt(attributes[index].length)];
    imgageObject.imageDNA += getImageDNA(currentFile);
    imgageObject.imageArray.push(`${folder}${currentFile}`);
  });

  return imgageObject;
}

// Test to merge images
function buildImages(num) {
  getFolders();
  getFiles();

  for (let i = 0; i < num; i++) {
    console.log("i & unique", i, uniqueAttempt);
    let imgObj = buildImgObject();

    if (!dnaArray.includes(imgObj.imageDNA)) {
      uniqueAttempt = 0;
      dnaArray.push(imgObj.imageDNA);

      let metaData = {
        name: `Crypto Mug Test ${i}`,
        symbol: "",
        description: "A test collection of randomly generated pixel mugs.",
        seller_fee_basis_points: 500,
        image: "image.png",
        attributes: [],
        collection: {
          name: "Crypto Mug Test",
          family: "JustMax NFTs",
        },
        properties: {
          files: [
            {
              uri: "image.png",
              type: "image/png",
            },
          ],
          category: "image",
          creators: [
            {
              address: `${process.env.MY_WALLET}`,
              share: 100,
            },
          ],
        },
      };

      let attArr = [];

      for (let x = 0; x < imgObj.imageArray.length; x++) {
        let string = imgObj.imageArray[x].split("/").slice(2);
        let obj = {
          trait_type: string[0].split("_")[1],
          value: string[1].split("_")[1],
        };
        metaData.attributes.push(obj);
      }

      // Write JSON file
      let dictstring = JSON.stringify(metaData);
      fs.writeFile(`./images/Results/${i}.json`, dictstring, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(`${i}.json CREATED`);
      });

      //Make the image
      mergeImages(imgObj.imageArray, {
        Canvas: Canvas,
      }).then((b64) => {
        let data = b64.replace(/^data:image\/\w+;base64,/, "");
        let buf = Buffer.from(data, "base64");
        fs.writeFile(`./images/Results/${i}.png`, buf, function (err) {
          if (err) {
            console.log(err);
          }
          console.log(`${i}.png CREATED`);
        });
      });

      console.log(`Crypto Mug #${i} Created!`);
    } else if (uniqueAttempt === 10) {
      //Make sure we don't try to make unique images too many times.
      console.log("Unique Attempt ", uniqueAttempt);
      console.log("Could not build a unique image too many times, quitting...");
      break;
    } else {
      i -= 1;
      uniqueAttempt += 1;
      console.log("Image not unique, trying again", uniqueAttempt);
    }
  }
}

buildImages(4);
