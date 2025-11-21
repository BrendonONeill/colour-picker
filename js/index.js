"use strict"

const canvas = document.getElementById('hueCanvas');
const ctx = canvas.getContext('2d');
const colorBox = document.getElementById('colorBox');
const divColourArray = document.querySelectorAll('.colour-history');
const divShade = document.querySelectorAll('.shade-pick');
const divShadeC = document.querySelectorAll('.shade-pick-c');

const box = document.querySelector('.box');
const box2 = document.querySelector('.box2');
const slider = document.getElementById('lightness')
const sliderText = document.querySelector('.lightness-text');

let light = 50;
const colourArray = new Array(6).fill(null)
console.log(colourArray)



canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    box.style.backgroundColor = color

})

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    box2.style.backgroundColor = color
    updateShadeArray(hue,sat,light)
    updateColourArray(color)
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
        for(let i = colourArray.length; i >= 0; i--)
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


function updateShadeArray(h,s,l)
{
    let shades = [-20,-10,0,10,20]

    divShade.forEach((shade,index) => {
        shade.style.backgroundColor = updateShade(h,s,l, shades[index])
    })
    let newH = complementaryHSL(h)
    divShadeC.forEach((shade,index) => {
        shade.style.backgroundColor = updateShade(newH,s,l, shades[index])
    })
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