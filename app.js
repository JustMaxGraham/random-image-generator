import mergeImages from 'merge-images-v2';
import * as fs from 'fs';
import Canvas from 'canvas';
const imagesPath = './images'

async function printFolders(imagesPath) {
  try {
    await fs.readdir(imagesPath, (err, files) => {
      files.forEach(file => {
        console.log(file);
      })
    })
  } catch(err) {
    console.log(err)
  }
}

// Test to merge images
mergeImages([
  './images/1_Backgrounds/Blue.png', 
  './images/2_Mugs/Mug_Red.png', 
  './images/3_Shading/Shading.png',
  './images/4_Image/Image Cat.png'], {
  Canvas: Canvas,
})
  .then(b64 => {
    let data = b64.replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(data, 'base64');
    fs.writeFile('./images/Results/test.png', buf, function(err) {
      if (err) {
        console.log(err)
      }
      console.log("Image Created")
    })
  });