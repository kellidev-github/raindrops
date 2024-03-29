let textInstructions = "click to start rain";
let displayText = true;
let filter; //created water color paper effect
let maxNewDrops = 5; //maximum # of newdrops generated in a draw cycle
let dropOverlap = 1;
let toRemove = []; //store indices of drops to remove

let makeDrops = false;

let maxRadius = 50;

//furthest distance to the right or left a falling drops moves
let maxXmove = 1;
let gradOffset = 0.1;
let drops = [];
let drops2remove = [];

let cycle = 0;

function preload() {
  soundFormats('ogg', 'mp3');
  sound1 = loadSound('2_Minute_Thunderstorm-Mike_Koenig-574654058.mp3');
}

function setup() {
  pixelDensity(1);
//   frameRate(10);
  let cnv = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  textAlign(CENTER, CENTER);

  //Filter
  filter = new makeFilter();
  
}


function mousePressed() {
  if (sound1.isPlaying()) {
    sound1.stop();
  } else {
    sound1.loop();
  }
  makeDrops = !makeDrops;
  displayText = false;
}


function draw() {
  //fill in watercolor paper bg to full window size
  background(250);
  if( displayText) {
    fill("#6cbbd4BF");
    textSize(windowHeight / 10);
    text(textInstructions, windowWidth/2, windowHeight/2);
  }

//   if( makeDrops) {
//     if(cycle % 2 == 0) {
//       //create several new raindrops as long as drops

//       for (let i = 0; i < random(maxNewDrops); i++) {
//         drops.push(new raindrop());
//       }
      
//       for (let drop of drops) {
//         //if drops overlap, larger drop increases radius
//         //smaller drop is removed
//         drop.updateSize();
//       }
//   //     print("\N Size Cylcle. Num Drops:" + drops.length); 
//     } else {
//       for (let drop of drops) {
//         //if drops overlap, larger drop increases radius
//         //smaller drop is removed
//         drop.updateLocation();
//       }
//   //     print("\N Location Cylcle. Num Drops:" + drops.length); 
//     }
    
    if( makeDrops) {
      //create several new raindrops as long as drops
      for (let i = 0; i < random(maxNewDrops); i++) {
        drops.push(new raindrop());
      }
      
      for (let drop of drops) {
        //if drops overlap, larger drop increases radius
        //smaller drop is removed
        drop.updateSize();
        drop.updateLocation();
      }
  }
    
  for (let drop of drops) {
    // draw the drop
    // save starting coordinates
    push();
    //translate coordinates to center on drop
    translate(drop.x, drop.y);
    //set radial fill
    radialGradient(
      -gradOffset*drop.r, -gradOffset*drop.r, 0, 
      -gradOffset*drop.r, -gradOffset*drop.r, drop.r, 
      drop.color1, drop.color2
    );
    //display raindrop
    drop.display();
    //          
    pop();
  }




  // // drops.push(new raindrop());


  // for (let drop of drops) {
  //   //update raindrop size and location
  //   drop.updateSize();


  //   // save starting coordinates
  //   push();
  //   //translate coordinates to center on drop
  //   translate(drop.x, drop.y);
  //   //set radial fill
  //   radialGradient(
  //     -gradOffset*drop.r, -gradOffset*drop.r, 0, 
  //     -gradOffset*drop.r, -gradOffset*drop.r, drop.r, 
  //     drop.color1, drop.color2
  //   );
  //   //display raindrop
  //   drop.display();
  //   //          
  //   pop();

  // }

  image(overAllTexture, 0, 0);
  cycle++;
//   print(drops.length);
}


// Raindrop Class
function raindrop(
  x = random(0, windowWidth), y = random(0, windowHeight), r = random(2, 10)
) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.distMovedx = 0;
  this.distMovedy = 0;

  // this.color1 = random(colors1);
  // this.color2 = random(colors2);

  this.color1 = "#5282a110";
  this.color2 = "#6cbbd4BF";

  this.updateSize = function() {
    for (let i = 0; i < drops.length; i++) {
      //compare the location of all other drops to this drop
      if (i != drops.indexOf(this) && drops[i].r > 0) {
        //calculate the distance between the center of the drops add radius of each minus overlap
        var d = dist(this.x, this.y, drops[i].x, drops[i].y) + this.r + drops[i].r - dropOverlap;

        // drops overlap if the distance between their centers is less than the sum of their diameters
        if (d < 2*(this.r + drops[i].r)) {
          this.r = max(d/2, this.r+drops[i].r);
          this.r = min(this.r, maxRadius);
          let xNew = (this.x + drops[i].x)/2;
          this.distMovedx +=  xNew - this.x;
          this.x = xNew;
          
          let yNew = max(this.y, (this.y + drops[i].y)/2);
          this.distMovedy += yNew - this.y;
          this.y = yNew;
          toRemove.push(i);
        }
      }
    }
    for(let i = 0; i < toRemove.length; i++) {
      drops.splice(toRemove[i], 1);
    }
    toRemove = [];
  }
//           //if this drop is smaller than the other drop
//           if (this.r < drops[i].r) {
//             //the other drop adds this drop's area to its area
// //             drops[i].r = sqrt(this.r*this.r + drops[i].r*drops[i].r);
//             drops[i].r = max(d - drops[i].r, drops[i].r);
//             //this drop's radius becomes zero
//             this.r = 0;
//             toRemove.push(i);

// //             let newX = (drops[i].r*drops[i].x + this.r * this.x) / ( drops[i].r + this.r);
// //             drops[i].xMoved += (newX - drops[i].x);
// //             drops[i].x = newX;

// //             if (drops[i].y < this.y) {
// //               let yMove = (drops[i].r*drops[i].y + this.r * this.y) / ( drops[i].r + this.r);
// //               drops[i].y += yMove;
// //               drops[i].distMovedy += yMove;
// //             }
//           } else {
//             //this drop adds the other drop to its area
// //             this.r = sqrt(this.r*this.r + drops[i].r*drops[i].r);
//             this.r = d - this.r;
//             //this drop's radius becomes zero
//             drops[i].r = 0;
//             toRemove.push(i);

// //             let newX = (drops[i].r*drops[i].x + this.r * this.x) / ( drops[i].r + this.r);
// //             this.xMoved += (newX - this.x);
// //             this.x = newX;

// //             if (this.y < drops[i].y) {
// //               let yMove = (drops[i].r*drops[i].y + this.r * this.y) / ( drops[i].r + this.r);
// //               this.y += yMove;
// //               this.distMovedy += yMove;
// //             }
//           }
//         }
//       }
//     }

  this.updateLocation = function() {
    if (this.r > 0.75*maxRadius) {
      let yMove = pow(this.r, 0.5);
      this.distMovedy += yMove;
      let xMove = random(-1*maxXmove, maxXmove);
      this.distMovedx += xMove;
      
      this.y += yMove;
      this.x += xMove;
      
//       if (this.r >= maxRadius) {
//         let newR = this.r - maxRadius;
//         drops.push(new raindrop(this.x, this.y - this.r - newR, newR-dropOverlap));
//         this.r = maxRadius;
//       } else {
//         let newR = max(5,random(0.25*this.r));
//         drops.push(new raindrop(this.x, this.y - this.r - newR, newR-dropOverlap));
//         this.r += -newR;
//       }
      
      let myAngle = atan(this.distMovedy/this.distMovedx);
      
      if (this.r > maxRadius) {
        let newR = this.r - maxRadius;       
        drops.push(new raindrop(this.x + this.r*cos(myAngle),this.y - this.r*sin(myAngle),newR));
        this.r = maxRadius;
      } else {
        let newR = random(sqrt(this.distMovedx*this.distMovedx+this.distMovedy*this.distMovedy))-1;
        if (newR >= 1 && (this.r - newR) > 1) {
          drops.push(new raindrop(this.x + this.r*cos(myAngle),this.y - this.r*sin(myAngle),newR));
          this.r = this.r - newR;
        }
      }
      this.distMovedx = 0;
      this.distMovedy = 0;
        
//       let newR = random(sqrt(this.distMovedx*this.distMovedx+this.distMovedy*this.distMovedy))-1;
//       if (newR >= 1 && (this.r - newR) > 1) {
//         this.r += -newR;
//         drops.push(new raindrop(this.x-this.distMovedx, this.y - this.distMovedy, newR));
//         print(newR);
//         this.distMovedx = 0;
//         this.distMovedy = 0;
//       }
      

      
//       let trailDropR = random(2, maxRadius/5);
//       if (trailDropR < (sqrt(this.xMoved*this.xMoved + this.yMoved*this.yMoved) + 2 * dropOverlap) ) {
//         this.r = this.r - trailDropR;
//         drops.push(new raindrop(this.x, this.y, trailDropR));
//         this.distMovedx = 0;
//         this.distMovedy = 0;
//       }
      
    }
      
    if ((this.y - this.r) > windowHeight) {
      toRemove.push(drops.indexOf(this));
    }
  }

//   this.update = function() {

//     for (let i = 0; i < drops.length; i++) {
//       if ( i != drops.indexOf(this) ) {
//         var d = maxRadius/10 + dist(this.x, this.y, drops[i].x, drops[i].y);
//         if (d < this.r + drops[i].r) {
//           let index;
//           if (this.r > drops[i].r) {
//             this.r += 0.5*drops[i].r;
//             if (this.r > maxRadius) {
//               this.r = maxRadius;
//             } 
//             this.x = (this.x + drops[i].x)/2;
//             this.y = (this.y + drops[i].y)/2;
//             index = drops.indexOf(drops[i]);
//           } else {
//             drops[i].r += 0.5*this.r;
//             if (this.r > maxRadius) {
//               drops[i].r = maxRadius;
//             } 
//             drops[i].x = (this.x + drops[i].x)/2;
//             drops[i].y = (this.y + drops[i].y)/2;
//             index = drops.indexOf(this);
//           }
//           drops.splice(index,1);
//           break;
//         }
//       }
//     }


//     if (this.r > 0.5 * maxRadius) {
//       this.y += pow(this.r, 0.75);
//       // this.y ++;
//       this.x += random(-1*maxXmove, maxXmove);
// //       print(this.x);
//       let newR = random(0.25*this.r);
//       if (newR < 5) {
//         newR = 5;
//       }
//       drops.push(new raindrop(this.x, this.y - this.r - newR, newR));
//       this.r += -newR;

//       if (this.r >= maxRadius) {
//         let newR = this.r - maxRadius;
//         drops.push(new raindrop(this.x, this.y - this.r - newR, newR));
//         this.r = maxRadius;
//       }
//     }

//     if ((this.y - this.r) > 600) {
//       let index = drops.indexOf(this);
//       drops.splice(index, 1);
//       print("drop removed");
//     }
//   }

  this.display = function() {
    ellipse(0, 0, this.r);
  }
}


// Radial Gradient Color
// from Kazuki Umeda's https://www.youtube.com/watch?v=-MUOweQ6wac
function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
  let gradient = drawingContext.createRadialGradient(
    sX, sY, sR, eX, eY, eR
  );
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}

// Watercolor Appearance Filter
// from SamuelYAN's https://openprocessing.org/sketch/143323:1
function makeFilter() {
  // noise
  colorMode(HSB, 360, 100, 100, 100);
  drawingContext.shadowColor = color(0, 0, 5, 95);
  overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();
  for (var i = 0; i < width; i++) { // noprotect
    for (var j = 0; j < height; j++) {
      overAllTexture.set(
        i,
        j,
        color(
          0,
          0,
          0,
          noise(i / 3, j / 3, (i * j) / 50) * random(5, 15)
        )
      );
    }
  }
  overAllTexture.updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
