"use strict"

const canvas = document.getElementById('hueCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth;
let canvasHeight; 
const colorBox = document.getElementById('colorBox');
const divColourArray = document.querySelectorAll('.colour-history');
const divShade = document.querySelectorAll('.shade-pick');
const divShadeC = document.querySelectorAll('.shade-pick-c');

const divAnaPos = document.querySelectorAll('.ana-pick-pos');
const divAnaMain = document.querySelectorAll('.ana-pick-main');
const divAnaNeg = document.querySelectorAll('.ana-pick-neg');

const hoverColour = document.querySelector(".hover-colour");
const colourpasteHSL = document.querySelector(".colour-paste-hsl");
const colourpasteHEX = document.querySelector(".colour-paste-hex");
const colourpasteRGBA = document.querySelector(".colour-paste-rgba");

const selectedColour = document.querySelector('.box');
const selectedColour2 = document.querySelector('.box2');

const selectedColourText = document.getElementById("selected-one-input");
const selectedColour2Text = document.getElementById("selected-two-input");

let selectedColourTextValue = ""
let selectedColour2TextValue = ""

const textForms = document.querySelectorAll(".text-form")

const slider = document.getElementById('lightness')
const sliderText = document.querySelector('.lightness-text');

const whiteAANormal = document.getElementById('w-aan');
const whiteAAANormal = document.getElementById('w-aaan');
const whiteAAALarge = document.getElementById('w-aal');
const whiteAALarge = document.getElementById('w-aaal');
const blackAANormal = document.getElementById('b-aan');
const blackAAANormal = document.getElementById('b-aaan');
const blackAALarge = document.getElementById('b-aal');
const blackAAALarge = document.getElementById('b-aaal');
const otherAANormal = document.getElementById('o-aan');
const otherAAANormal = document.getElementById('o-aaan');
const otherAALarge = document.getElementById('o-aal');
const otherAAALarge = document.getElementById('o-aaal');

const textButtons = document.querySelectorAll(".text-button");
const tabCopy = document.querySelector(".tab");

let pendingUpdate = false


let light = 50;
const colourArray = new Array(10).fill(null)

let selectedColours = {
    firstSelected : {hue: 0, light: 0, sat: 0, hsl:"hsl(0 0% 0%)", hex:"#000000", rgba:"rgba(0, 0, 0, 1)",contrast:{white:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null},black:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null},other:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null}}},
    secondSelected : {hue: 0, light: 0, sat: 0, hsl:"hsl(0, 100%, 100%)", hex:"#ffffff", rgba:"rgba(255, 255, 255, 1)", contrast:{white:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null},black:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null},other:{aaNormal:null,aaaNormal:null,aaLarge:null,aaaLarge:null}}},
    activeSelection : "firstSelected"
}


selectedColour.addEventListener("click", () => {
        if(!selectedColour.classList.contains("activeSelected"))
        {
            selectedColour.classList.add("activeSelected");
            selectedColours.activeSelection = "firstSelected"
            handleColourUpdates(selectedColours.firstSelected.hsl,selectedColours.firstSelected.hue,selectedColours.firstSelected.light,selectedColours.firstSelected.sat, false)
            updateColourText()
            allContrastCheckers(selectedColours.activeSelection)
        }
        if(selectedColour2.classList.contains("activeSelected"))
        {
            selectedColour2.classList.remove("activeSelected");
        }
        
})



selectedColour2.addEventListener("click", () => {
        if(!selectedColour2.classList.contains("activeSelected"))
        {
            selectedColour2.classList.add("activeSelected");
            selectedColours.activeSelection = "secondSelected"
            handleColourUpdates(selectedColours.secondSelected.hsl,selectedColours.secondSelected.hue,selectedColours.secondSelected.light,selectedColours.secondSelected.sat, false)
            updateColourText()
            allContrastCheckers(selectedColours.activeSelection)
        }
        if(selectedColour.classList.contains("activeSelected"))
        {
            selectedColour.classList.remove("activeSelected");
        }
})

selectedColourText.addEventListener("focus",(e) => {
    selectedColourTextValue = e.target.value;
})

selectedColour2Text.addEventListener("focus",(e) => {
    selectedColour2TextValue = e.target.value;
})

selectedColourText.addEventListener("blur", (e) => {
    inputBlurHandler(e.target,selectedColourTextValue,"firstSelected",selectedColour,selectedColour2);
})

selectedColour2Text.addEventListener("blur", (e) => {
   inputBlurHandler(e.target,selectedColour2TextValue,"secondSelected",selectedColour2,selectedColour);
})

textForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
    e.preventDefault();
});
})



function createCanvas(light,width,height)
{
    let countHor = 0
    for(let i = 0; i <= 360; i++)
    {
        ctx.fillStyle = `hsla(${i}, 100%, ${light}%, 1.00)`;
        ctx.fillRect(countHor, 0, width, height);
        let countVert = height;
        for(let j = 99; j >= 0; j--)
        {
            ctx.fillStyle = `hsla(${i}, ${j}%, ${light}%, 1.00)`;
            ctx.fillRect(countHor, countVert, width, height);
            countVert = countVert + height;
        }
        countHor = countHor + width;
    }
}

if(window.screen.width > 710)
{
    canvas.style.width = "720px";
    canvas.style.height = "500px";
    canvasWidth = 720
    canvasHeight = 500
    createCanvas(light,2,5)
}
else
{
    canvas.style.width = "360px";
    canvas.style.height = "250px";
    canvasWidth = 360
    canvasHeight = 250
    createCanvas(light,2,5)
}


canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvasWidth) * 360);
    const sat = Math.round((100 - (y / canvasHeight) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    hoverColour.style.backgroundColor = color
    hoverColour.style.transform = `translate(${((e.clientX + window.scrollX) + 5)}px, ${((e.clientY + window.scrollY) - 110)}px)`;

    if (!pendingUpdate) {
    pendingUpdate = true;
    requestAnimationFrame(() => {
        hoverColour.style.backgroundColor = color
        hoverColour.style.transform = `translate(${((e.clientX + window.scrollX) + 5)}px, ${((e.clientY + window.scrollY) - 110)}px)`;
        pendingUpdate = false;
    });
  }
})

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvasWidth) * 360);
    const sat = Math.round((100 - (y / canvasHeight) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    setSelectedColoursValues(hue,sat,light);
    if(selectedColours.activeSelection === "firstSelected")
    {
         selectedColour.style.backgroundColor = color
    }
    else
    {
         selectedColour2.style.backgroundColor = color
    }
   
    handleColourUpdates(color, hue, light, sat, true)
    allContrastCheckers(selectedColours.activeSelection)
    updateInputColour(selectedColours[selectedColours.activeSelection].hex)
})

canvas.addEventListener("mouseenter", (e) => {
    hoverColour.classList.remove("colour-display-none")
})

canvas.addEventListener("mouseout", (e) => {
    hoverColour.classList.add("colour-display-none")
})




function clearCanvas()
{
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}


slider.addEventListener("input",(e) => {

    clearCanvas()
    sliderText.textContent = e.target.value;
    light = e.target.value
    if(!pendingUpdate) {
        pendingUpdate = true;
        requestAnimationFrame(() => {
            createCanvas(light,2,5);
            pendingUpdate = false;
        })
    }
})


function updateColourArray(colour)
{
    if(colourArray[0] === null)
    {
        colourArray[0] = colour
        updateDivColour()
        return
    }
    let nullInArray= false;
    let nullLocation = -1
    for(let i = 0; i < colourArray.length; i++)
    {
        if(colourArray[i] === null)
        {
            nullLocation = i
            nullInArray = true
            break
        }
    }
    if(nullInArray)
    {
        for(let i = nullLocation; i >= 0; i--)
        {
            let before = i - 1
            if(before >= 0)
            {
                colourArray[i] = colourArray[i - 1] 
            }
            else
            {
                colourArray[i] = colour
            }
        }
        updateDivColour()
        return
    }
    else
    {
        for(let i = colourArray.length-1; i >= 0; i--)
        {
            let before = i - 1
            if(before >= 0)
            {
                colourArray[i] = colourArray[i - 1] 
            }
            else
            {
                colourArray[i] = colour
            }
        }
        updateDivColour()
    }
}

function updateColourArrayPart2(num)
{
    let clickedColour = colourArray[num - 1]
    for(let i = (num - 1); i >= 0; i--)
    {
        let before = i - 1
        if(before >= 0)
        {
            colourArray[i] = colourArray[i - 1] 
        }
        else
        {
            colourArray[i] = clickedColour
        }
    }
    updateDivColour()
}


function updateDivColour()
{
    let i = 0
    divColourArray.forEach((div) => {
        if(colourArray[i] !== null)
        {
            div.style.backgroundColor = colourArray[i];
        }
        i++
    })
}


function updateShadeArray(s,l,arrayOfDivs, arrayOfHues)
{
    let shades = [];
    if(l > 80)
    {
        let tempValue = 100 - l;
        if(tempValue > 10)
        {
            shades = [-20,-10,0,10,tempValue]
        }
        else
        {
            shades = [-30,-20,-10,0,tempValue]
        }
    }
    else if(l < 20)
    {
        if(l < 10)
        {
            
            shades = [-l,0,10,20,30]
        }
        else
        {
            shades = [-l,-10,0,10,20]
        }
    }
    else
    {
        shades = [-20,-10,0,10,20]
    }
    for(let i = 0; i < arrayOfDivs.length; i++)
    {
        arrayOfDivs[i].forEach((shade,index) => {
        shade.style.backgroundColor = updateShade(arrayOfHues[i],s,l, shades[index])
    })
    }
}


function updateShade(h, s, l, deltaL) {
    let newL = l + deltaL
    return `hsl(${h}, ${s}%, ${newL}%)`
}

function complementaryHSL(h) {
  // Ensure hue stays between 0–360
  const compH = (h + 180) % 360;
  return compH;
}


function AnalogousHSLArray(h)
{
    let analogousArray = []
    if((h + 30) > 360)
    {
        analogousArray.push((h + 30) - 360)
    }
    else
    {
        analogousArray.push(h + 30)
    }
    analogousArray.push(h)
    analogousArray.push(Math.abs(h - 30))
    return analogousArray
}


function handleColourUpdates(colour, hue, light, sat, updateArray,part2 = null)
{
    let complementaryHue  = complementaryHSL(hue)
    let analogousArray = AnalogousHSLArray(hue)
    updateShadeArray(sat,Number(light),[divShade,divShadeC],[hue,complementaryHue])
    updateShadeArray(sat,Number(light),[divAnaPos,divAnaMain,divAnaNeg],analogousArray)
    if(updateArray)
    {
        if(part2 !== null)
        {
            updateColourArrayPart2(part2)
        }
        else
        {
            updateColourArray(colour)
        }
    }
}

function setSelectedColoursValues(hue,sat,light)
{
    selectedColours[selectedColours.activeSelection].hue = hue
    selectedColours[selectedColours.activeSelection].sat = sat
    selectedColours[selectedColours.activeSelection].light = light
    selectedColours[selectedColours.activeSelection].hsl = `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`
    let colourHex = hslToHex(hue,sat,light);
    let colourRGBA = hslToRgba(hue,sat,light, 1);
    selectedColours[selectedColours.activeSelection].hex = colourHex
    selectedColours[selectedColours.activeSelection].rgba = colourRGBA
    updateColourText()
}


function updateColourText()
{
    colourpasteHSL.textContent = selectedColours[selectedColours.activeSelection].hsl
    colourpasteHEX.textContent = selectedColours[selectedColours.activeSelection].hex.toUpperCase()
    colourpasteRGBA.textContent = selectedColours[selectedColours.activeSelection].rgba
}


divColourArray.forEach((button) => {
    button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor, e.target.dataset.colourId)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    })
})

divShade.forEach((button) => {
    if(!button.classList.contains("main"))
    {
        button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    })
    }
    
})

divShadeC.forEach((button) => {
        button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    })
})

divAnaPos.forEach((button) => {
        button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    })
})

divAnaMain.forEach((button) => {
    if(!button.classList.contains("main"))
    {
        button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    })
    }
    
})

divAnaNeg.forEach((button) => {
        button.addEventListener("click", (e) => {
        handleColourClicked(e.target.style.backgroundColor)
        updateInputColour(selectedColours[selectedColours.activeSelection].hex)
    }) 
})

function handleColourClicked(rgba,colourId=null)
{
    let hslValue = rgbaToHsl(rgba);
    setSelectedColoursValues(hslValue.h,hslValue.s,hslValue.l);
    if(selectedColours.activeSelection === "firstSelected")
    {
        selectedColour.style.backgroundColor = hslValue.colour
    }
    else
    {
        selectedColour2.style.backgroundColor = hslValue.colour
    }
    handleColourUpdates(hslValue.colour, hslValue.h, hslValue.l, hslValue.s, true,colourId)
    allContrastCheckers(selectedColours.activeSelection)
}

function stripHslString(hsl) {
  const matches = hsl.match(/\d+/g);

  if (!matches || matches.length < 3) {
    return null;
  }

  const [h, s, l] = matches.map(Number);

  return {
    h,
    s,
    l,
  };
}

function hslToRgba(h, s, l, a = 1) {
  // Convert percentages to decimals
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  // Convert to 0–255 RGB values
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}


function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => {
  const raw = (v + m) * 255;
  const rounded = Math.round((raw + Number.EPSILON) * 1e10) / 1e10;
  const hex = Math.round(rounded).toString(16);
  return hex.padStart(2, "0");
  };

  const hexString = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return hexString;
}

function hexToRgb(hex) {
  let cleaned = hex.replace(/^#/, "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbaToHsl(rgbaString) {
  // Extract RGB values from string
  const match = rgbaString.match(/\d+/g);
  const [r, g, b] = match.map((val) => parseInt(val) / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    // Calculate saturation
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate hue
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6;
    } else {
      h = ((r - g) / delta + 4) / 6;
    }
  }
  // Convert to degrees and percentages
  h = h * 360;
  s = s * 100;
  l = l * 100;

  return {colour:`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`,h,s,l};
}

function allContrastCheckers(active)
{
    let mainColour;
    let test = selectedColours[active].rgba.toLowerCase()
    mainColour = selectedColours[active].rgba.match(/\d+/g)
    if(test.startsWith(!"rgba"))
    {
        mainColour.push("1")
    }

    let otherColour;

    if(active == "firstSelected")
    {
        otherColour = selectedColours.secondSelected.rgba.match(/\d+/g)
    }
    else
    {
        otherColour = selectedColours.firstSelected.rgba.match(/\d+/g)
    }
    console.log(mainColour,otherColour)
    let whiteObj = contrastChecker({r:255,g:255,b:255},{r:mainColour[0],g:mainColour[1],b:mainColour[2]})
    let blackObj = contrastChecker({r:0,g:0,b:0},{r:mainColour[0],g:mainColour[1],b:mainColour[2]})
    let otherObj = contrastChecker({r:mainColour[0],g:mainColour[1],b:mainColour[2]},{r:otherColour[0],g:otherColour[1],b:otherColour[2]})
    
    selectedColours[active].contrast.white.aaNormal = whiteObj.AANormal
    selectedColours[active].contrast.white.aaaNormal = whiteObj.AAANormal
    selectedColours[active].contrast.white.aaLarge = whiteObj.AALarge
    selectedColours[active].contrast.white.aaaLarge = whiteObj.AAALarge

    selectedColours[active].contrast.black.aaNormal = blackObj.AANormal
    selectedColours[active].contrast.black.aaaNormal = blackObj.AAANormal
    selectedColours[active].contrast.black.aaLarge = blackObj.AALarge
    selectedColours[active].contrast.black.aaaLarge = blackObj.AAALarge

    selectedColours[active].contrast.other.aaNormal = otherObj.AANormal
    selectedColours[active].contrast.other.aaaNormal = otherObj.AAANormal
    selectedColours[active].contrast.other.aaLarge = otherObj.AALarge
    selectedColours[active].contrast.other.aaaLarge = otherObj.AAALarge
    
    updateChecker()
}

function contrastChecker(textColour, backgroundColour)
{
    const text = getLuminance(textColour.r,textColour.g,textColour.b);
    const background = getLuminance(backgroundColour.r,backgroundColour.g,backgroundColour.b);

    const ratio = getContrastRatio(text,background);
    
    let results = {AANormal:null,AAANormal:null,AALarge:null,AAALarge:null}
        if(ratio >= 4.5)
        {
            results.AANormal = true
            results.AAALarge = true
        }
        else
        {
            results.AANormal = false
            results.AAALarge = false
        }

        if(ratio >= 7)
        {
             results.AAANormal = true
        }
        else
        {
            results.AAANormal = false
        }

        if(ratio >= 3)
        {
            results.AALarge = true
        }
        else
        {
             results.AALarge = false
        }

    return results
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function inputBlurHandler(inputText,selectedColourTextValue, selectedInput,colourBlock,colourBlock2)
{
    
    let value = inputText.value.trim()
    if(!value) 
    {
        inputText.classList.add("error-input");
        return;
    }
    if(value === selectedColourTextValue) 
    {
        inputText.classList.add("error-input");
        return;
    }
    if(!CSS.supports("color", value))
    {
        inputText.classList.add("error-input");
        return;
    }
    else
    {
        let rgbValue;
        let hslObj;
        let hexValue;
        if(value.startsWith("hsl" || "HSL"))
        {
            hslObj = stripHslString(value.toLowerCase())
            hslObj.colour = `hsl(${Math.round(hslObj.h)},${Math.round(hslObj.s)}%,${Math.round(hslObj.l)}%)`
            hexValue = hslToHex(hslObj.h,hslObj.s,hslObj.l)
            rgbValue = hslToRgba(hslObj.h,hslObj.s,hslObj.l)
        }
        else if(value.startsWith("#"))
        {
            hexValue = value;
            rgbValue = hexToRgb(value);
            hslObj = rgbaToHsl(rgbValue);
        }
        else if(value.startsWith("rgb" || "RGB"))
        {
            rgbValue = value;
            hslObj = rgbaToHsl(value);
            hexValue = hslToHex(hslObj.h,hslObj.s,hslObj.l);

        }
        else
        {
            inputText.classList.add("error-input");
            return;
        }
        
        selectedColours[selectedInput].rgba = rgbValue;
        selectedColours[selectedInput].hex = hexValue;
        selectedColours[selectedInput].hsl = hslObj.colour;
        selectedColours[selectedInput].hue = hslObj.h;
        selectedColours[selectedInput].sat = hslObj.s;
        selectedColours[selectedInput].light = hslObj.l;
        colourBlock.style.backgroundColor = value;
        selectedColours.activeSelection = selectedInput;
        colourBlock.classList.add("activeSelected")
         if(colourBlock2.classList.contains("activeSelected"))
        {
            colourBlock2.classList.remove("activeSelected");
        }
        
        updateColourText()
        handleColourUpdates(selectedColours[selectedInput].hsl,selectedColours[selectedInput].hue,selectedColours[selectedInput].light,selectedColours[selectedInput].sat, true)
        allContrastCheckers(selectedColours.activeSelection)
        inputText.classList.remove("error-input");
    }
}

function updateChecker()
{
    const checkerObj = selectedColours[selectedColours.activeSelection].contrast;
    if(checkerObj.white.aaNormal)
    {
        whiteAANormal.src = "true.svg";
    }
    else
    {
        whiteAANormal.src = "false.svg";
    }
    if(checkerObj.white.aaaNormal)
    {
        whiteAAANormal.src = "true.svg";
    }
    else
    {
        whiteAAANormal.src = "false.svg";
    }
    if(checkerObj.white.aaLarge)
    {
        whiteAALarge.src = "true.svg";
    }
    else
    {
        whiteAALarge.src = "false.svg";
    }
    if(checkerObj.white.aaaLarge)
    {
        whiteAAALarge.src = "true.svg";
    }
    else
    {
        whiteAAALarge.src = "false.svg";
    }

    if(checkerObj.black.aaNormal)
    {
        blackAANormal.src = "true.svg";
    }
    else
    {
        blackAANormal.src = "false.svg";
    }
    if(checkerObj.black.aaaNormal)
    {
        blackAAANormal.src = "true.svg";
    }
    else
    {
        blackAAANormal.src = "false.svg";
    }
    if(checkerObj.black.aaLarge)
    {
        blackAALarge.src = "true.svg";
    }
    else
    {
        blackAALarge.src = "false.svg";
    }
    if(checkerObj.black.aaaLarge)
    {
        blackAAALarge.src = "true.svg";
    }
    else
    {
        blackAAALarge.src = "false.svg";
    }

    if(checkerObj.other.aaNormal)
    {
        otherAANormal.src = "true.svg";
    }
    else
    {
        otherAANormal.src = "false.svg";
    }
    if(checkerObj.other.aaaNormal)
    {
        otherAAANormal.src = "true.svg";
    }
    else
    {
        otherAAANormal.src = "false.svg";
    }
    if(checkerObj.other.aaLarge)
    {
        otherAALarge.src = "true.svg";
    }
    else
    {
        otherAALarge.src = "false.svg";
    }
    if(checkerObj.other.aaaLarge)
    {
        otherAAALarge.src = "true.svg";
    }
    else
    {
        otherAAALarge.src = "false.svg";
    }
}

textButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let a = button.querySelector("p").textContent;
        tabCopy.classList.remove("colour-display-none")
        navigator.clipboard.writeText(a)
        setTimeout(() => {
            tabCopy.classList.add("colour-display-none")
        },3000)
    })
    
})

function updateInputColour(value)
{
    if(selectedColours.activeSelection === "firstSelected")
    {
        selectedColourText.value = value.toUpperCase()
    }
    else
    {
        selectedColour2Text.value = value.toUpperCase()
    }
}

const testing = [["03045e","0077b6","00b4d8","90e0ef","caf0f8"],["ff99c8","fcf6bd","d0f4de","a9def9","e4c1f9"],["1a535c","4ecdc4","f7fff7","ff6b6b","ffe66d"],["e5d9f2","f5efff","cdc1ff","a594f9","7371fc"],["ef7674","ec5766","da344d","d91e36","c42348"],["000000","66666e","9999a1","e6e6e9","f4f4f6"]]

function generatePalettes(arr)
{
    const collection = document.querySelector(".palettes-container")
    for (let i = 0; i < arr.length; i++) {
        let mainContainer = document.createElement("div");
        mainContainer.classList.add("palette");
        let newPalette = generatePalette(mainContainer, arr[i])
        collection.append(newPalette);
    }
}


function generatePalette(mainContainer, arr)
{
    for (let i = 0; i < arr.length; i++) {
        let div = document.createElement("div");
        let colourDiv = document.createElement("button");
        let colourP = document.createElement("p");

        div.classList.add("palette-colour-container");
        colourDiv.classList.add("button-reset", "colour-pal");
        colourDiv.setAttribute('aria-label', `Palette colour #${arr[i]}`);
        colourDiv.style.background =`#${arr[i]}`;
        colourDiv.addEventListener("click", (e) => 
            {
                handleColourClicked(e.target.style.backgroundColor)
                updateInputColour(selectedColours[selectedColours.activeSelection].hex)
            })
        colourP.textContent = arr[i].toUpperCase();
        div.append(colourDiv,colourP);

        mainContainer.append(div);
    }

    return mainContainer;
}

generatePalettes(testing)

