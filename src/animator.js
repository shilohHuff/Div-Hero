
// takes data for a sprite sheet and returns an array of objects with the
// metadata representing individual sprites, equal to the frameCount.
export function getSpriteSheetData(config) {
    //sheetWidth, sheetHeight, offsetX, offsetY, spriteWidth, spriteHeight, spaceX, spaceY, frameCount
    
    let slices = [];
      
    // find out how many sprites fit in the remaining space on the sheet.
    let spritesPerRow = Math.floor((config.sheetHeight - config.offsetY) / (config.spriteHeight + config.spaceY));
  
    // slice and dice the sheet with the power of math
    for (let i = 0; i < config.frameCount; i++) {
        // if we go out-of-bounds on the sheet, go to the next row
        let spriteSheetCol = Math.floor(i % spritesPerRow);
        let spriteSheetRow = Math.floor(i / spritesPerRow);
  
        let x = config.offsetX + (spriteSheetCol * (config.spriteWidth + config.spaceX));
        let y = config.offsetY + (spriteSheetRow * (config.spriteHeight + config.spaceY));
        let w = config.spriteWidth;
        let h = config.spriteHeight;
  
        slices.push({
            x: x,
            y: y,
            w: w,
            h: h
        });
    }
      
    return slices;
}
  
export default function Animation(node, sprites, delay, scaleFactor) {
    this.node = node;
    this.sprites = sprites;
    this.delay = delay;
    this.scaleFactor = scaleFactor;
    
    this.framesSince = 0;
    this.currentFrame = 0;
    
    this.isXFlipped = false;
}
  
Animation.prototype.render = function() {
    if (this.framesSince > this.delay * (this.sprites.length - 1)) {
        this.framesSince = 0;
    }
    
    this.currentFrame = Math.floor(this.framesSince / this.delay);
    
    this.node.style.backgroundPosition = (-this.sprites[this.currentFrame].x * this.scaleFactor) + 'px ' + (-this.sprites[this.currentFrame].y * this.scaleFactor) + 'px';
    
    if (this.isXFlipped) {
        this.node.style.transform = 'scaleX(-1)';
    } else {
        this.node.style.transform = 'scaleX(1)';
    }
    
    this.framesSince++;
};
  
  
// mario.animations.running = new Animation(
//   document.getElementById('test'), 
//   getSpriteSheetData({
//     sheetWidth: 491, 
//     sheetHeight: 282, 
//     offsetX: 36, 
//     offsetY: 82, 
//     spriteWidth: 34, 
//     spriteHeight: 49, 
//     spaceX: 1, 
//     spaceY: 1, 
//     frameCount: 10
//   }), 
//   Math.PI
// );
  
// mario.animations.running.isXFlipped = true;
  
  
  
// // some time later...
// mario.animations.running.render();
  
  