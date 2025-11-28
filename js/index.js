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
const colourpaste = document.querySelector(".colour-paste");

const box = document.querySelector('.box');
const box2 = document.querySelector('.box2');
const slider = document.getElementById('lightness')
const sliderText = document.querySelector('.lightness-text');

let light = 50;
const colourArray = new Array(10).fill(null)
console.log(colourArray)



canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    box.style.backgroundColor = color
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
    box2.style.backgroundColor = color
    colourpaste.textContent = color
    let complementaryHue  = complementaryHSL(hue)
    let analogousArray = AnalogousHSLArray(hue)
    updateShadeArray(sat,Number(light),[divShade,divShadeC],[hue,complementaryHue])
    updateShadeArray(sat,Number(light),[divAnaPos,divAnaMain,divAnaNeg],analogousArray)
    updateColourArray(color)
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
    console.log("called")
    debugger
    for(let i = 0; i < arrayOfDivs.length; i++)
    {
        arrayOfDivs[i].forEach((shade,index) => {
        console.log(shade)
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
    console.log(analogousArray)
    return analogousArray
}