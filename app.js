import mergeImages from "merge-images-v2";
import * as fs from "fs";
import Canvas from "canvas";

const imagesPath = "./images";
const imageCount = 10;

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

// Will build an array with all images paths needed to build random image
function buildImgArray() {
  let imgageArray = [];
  folders.forEach((folder, index) => {
    imgageArray.push(
      `${folder}${attributes[index][getRandomInt(attributes[index].length)]}`
    );
  });
  return imgageArray;
}

// Test to merge images
function buildImages() {
  getFolders();
  getFiles();

  for (let i = 0; i < imageCount; i++) {
    let imgArr = buildImgArray();

    mergeImages(imgArr, {
      Canvas: Canvas,
    }).then((b64) => {
      let data = b64.replace(/^data:image\/\w+;base64,/, "");
      let buf = Buffer.from(data, "base64");
      fs.writeFile(`./images/Results/Crypto_Mug_${i}.png`, buf, function (err) {
        if (err) {
          console.log(err);
        }
        console.log(`Crypto Mug #${i} Created!`);
      });
    });
  }
}

buildImages();
