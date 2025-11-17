const canvas = document.getElementById('hueCanvas');
const ctx = canvas.getContext('2d');
const colorBox = document.getElementById('colorBox');

const box = document.querySelector(".box");
const slider = document.getElementById("lightness")
let light = 50


canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(rect)

    const hue = Math.round((x / canvas.width) * 360);
    const sat = Math.round((100 - (y / canvas.height) * 100));
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    box.style.backgroundColor = color

})

function createCanvas(light)
{
    let countHor = 0
    for(let i = 0; i <= 360; i++)
    {
        ctx.fillStyle = `hsla(${i}, 100%, ${light}%, 1.00)`;
        ctx.fillRect(countHor, 0, 2, 5);
        let countVert = 5
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
    light = e.target.value
    createCanvas(light)
})