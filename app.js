import mergeImages from "merge-images-v2";
import * as fs from "fs";
import Canvas from "canvas";
import util from "util";

const imagesPath = "./images";
const dnaArray = [];
let uniqueAttempt = 0;

let folders = []; // ["folder1", "folder2", "folder3"]
let attributes = []; //[["f1t1", "f1t2"],["f2t1", "f2t2"], ["f3t1", "f3t2", "f3t3"]]
let jsonData = []; // Array with nft metadata objects

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
  //console.log("Filename for DNA: ", fileName);
  let dnaStrand = fileName.split("_")[1].split(".")[0];
  //console.log("Strand ", dnaStrand);
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

  if (uniqueAttempt < 10) {
    for (let i = 0; i < num; i++) {
      let imgObj = buildImgObject();

      if (!dnaArray.includes(imgObj.imageDNA)) {
        uniqueAttempt = 0;
        dnaArray.push(imgObj.imageDNA);
        // console.log(dnaArray);

        let metaData = {
          dna: "",
          image: "url",
          tokenId: i,
          name: `Crypto Mug ${i}`,
          attributes: [],
        };

        metaData.dna = imgObj.imageDNA;

        let attArr = [];

        for (let x = 0; x < imgObj.imageArray.length; x++) {
          let string = imgObj.imageArray[x].split("/").slice(2);
          let obj = {
            trait_type: string[0],
            value: string[1],
          };
          metaData.attributes.push(obj);
          // console.log("object: ", obj);
        }

        metaData.attributes.push(attArr);

        jsonData.push(metaData);

        mergeImages(imgObj.imageArray, {
          Canvas: Canvas,
        }).then((b64) => {
          let data = b64.replace(/^data:image\/\w+;base64,/, "");
          let buf = Buffer.from(data, "base64");
          fs.writeFile(
            `./images/Results/Crypto_Mug_${i}.png`,
            buf,
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
        });

        console.log(`Crypto Mug #${i} Created!`);
      } else {
        uniqueAttempt += 1;
        console.log("Image not unique, trying again");
      }
      // console.log(imgArr);
    }
  } else {
    console.log("Failed to create a unique image too many times, quitting.");
  }
}

buildImages(1);
console.log("Resutls: ", util.inspect(jsonData, false, null, true));
