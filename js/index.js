"use strict"

const canvas = document.getElementById('hueCanvas');
const ctx = canvas.getContext('2d');
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
const slider = document.getElementById('lightness')
const sliderText = document.querySelector('.lightness-text');

let light = 50;
const colourArray = new Array(10).fill(null)

let selectedColours = {
    firstSelected : {hue: 0, light: 0, sat: 0, hsl:"hsl(0 0% 0%)", hex:"#000000", rgba:"rgba(0, 0, 0, 1)"},
    secondSelected : {hue: 0, light: 0, sat: 0, hsl:"hsl(0, 100%, 100%)", hex:"#ffffff", rgba:"rgba(255, 255, 255, 1)"},
    activeSelection : "firstSelected"
}


selectedColour.addEventListener("click", () => {
        if(!selectedColour.classList.contains("activeSelected"))
        {
            selectedColour.classList.add("activeSelected");
            selectedColours.activeSelection = "firstSelected"
            handleColourUpdates(selectedColours.firstSelected.hsl,selectedColours.firstSelected.hue,selectedColours.firstSelected.light,selectedColours.firstSelected.sat, false)
            updateColourText()
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
        }
        if(selectedColour.classList.contains("activeSelected"))
        {
            selectedColour.classList.remove("activeSelected");
        }
})

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    hoverColour.style.backgroundColor = color
    hoverColour.style.transform = `translate(${(e.clientX + 10)}px, ${(e.clientY - 35)}px)`;
})

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    setSelectedColoursValues(color,hue,sat,light);
    if(selectedColours.activeSelection === "firstSelected")
    {
         selectedColour.style.backgroundColor = color
    }
    else
    {
         selectedColour2.style.backgroundColor = color
    }
   
    handleColourUpdates(color, hue, light, sat, true)
})

canvas.addEventListener("mouseenter", (e) => {
    hoverColour.classList.remove("colour-display-none")
})

canvas.addEventListener("mouseout", (e) => {
    hoverColour.classList.add("colour-display-none")
})

function createCanvas(light)
{
    let countHor = 0
    for(let i = 0; i <= 360; i++)
    {
        ctx.fillStyle = `hsla(${i}, 100%, ${light}%, 1.00)`;
        ctx.fillRect(countHor, 0, 2, 5);
        let countVert = 5;
        for(let j = 99; j >= 0; j--)
        {
            ctx.fillStyle = `hsla(${i}, ${j}%, ${light}%, 1.00)`;
            ctx.fillRect(countHor, countVert, 2, 5);
            countVert = countVert + 5;
        }
        countHor = countHor + 2;
    }
}

createCanvas(light)

function clearCanvas()
{
    ctx.clearRect(0, 0, 720, 500);
}


slider.addEventListener("change",(e) => {

    clearCanvas()
    sliderText.textContent = e.target.value;
    light = e.target.value
    createCanvas(light)
})


function updateColourArray(colour)
{
    debugger
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
    debugger
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


function handleColourUpdates(colour, hue, light, sat, updateArray)
{
    let complementaryHue  = complementaryHSL(hue)
    let analogousArray = AnalogousHSLArray(hue)
    updateShadeArray(sat,Number(light),[divShade,divShadeC],[hue,complementaryHue])
    updateShadeArray(sat,Number(light),[divAnaPos,divAnaMain,divAnaNeg],analogousArray)
    if(updateArray)
    {
        updateColourArray(colour)
    }
}

function setSelectedColoursValues(colour,hue,sat,light)
{
    selectedColours[selectedColours.activeSelection].hue = hue
    selectedColours[selectedColours.activeSelection].sat = sat
    selectedColours[selectedColours.activeSelection].light = light
    selectedColours[selectedColours.activeSelection].hsl = colour
    let colourHex = hslToHex(hue,sat,light);
    let colourRGBA = hslToRgba(hue,sat,light, 1);
    selectedColours[selectedColours.activeSelection].hex = colourHex
    selectedColours[selectedColours.activeSelection].rgba = colourRGBA
    updateColourText()
}


function updateColourText()
{
    colourpasteHSL.textContent = selectedColours[selectedColours.activeSelection].hsl
    colourpasteHEX.textContent = selectedColours[selectedColours.activeSelection].hex
    colourpasteRGBA.textContent = selectedColours[selectedColours.activeSelection].rgba
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
    const hex = Math.round((v + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}