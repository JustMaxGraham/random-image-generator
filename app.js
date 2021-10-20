import mergeImages from 'merge-images';
import * as fs from 'fs';
import Canvas from 'canvas';

const { Image } = Canvas

const imagesPath = './images'

async function printFolders(imagePath) {
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

printFolders(imagesPath);