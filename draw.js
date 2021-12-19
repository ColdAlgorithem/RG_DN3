import {AABB,QuadTree, Point} from "./QuadTree.js"

let canvas = document.getElementById("myCanvas")
let gridOn = document.getElementById("eG")
let max = document.getElementById("num")
let sea = document.getElementById("sea")
let dis = document.getElementById("dis")
let ctx= canvas.getContext("2d")

let qOnT = false
let seaT = false;
let points=[]
let boundry = new AABB(0,0,canvas.width,canvas.height)
let quadT = new QuadTree(boundry)
let sedajKrogi=0;
let max_krogcov=10;

canvas.addEventListener("mousedown",function putPoint(event) {
    let mX=event.offsetX
    let mY=event.offsetY
    points.push(new Point(mX,mY))
    max_krogcov++;
    sedajKrogi++;
})

function drawScean(){
    canvas.onresize=resizeC()
    let width = canvas.width
    let height = canvas.height
    sea.onclick= showCircle
    max.onchange=changeMax
    gridOn.onclick = showGrid

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boundry = new AABB(0,0,canvas.width,canvas.height)
    quadT = new QuadTree(boundry)

    if(points.length==0 || sedajKrogi!=max_krogcov){
        if(sedajKrogi<max_krogcov){
            for (let i=sedajKrogi;i<max_krogcov;i++){
                let w = Math.random() * width
                let h = Math.random() * height
                let p = new Point(w,h)
                points.push(p)
                quadT.insert(p)
            }
        }
        else{
            points=points.slice(0,max_krogcov)
            for(let p of points) quadT.insert(p)
        }
        sedajKrogi=max_krogcov
    }
    else{
        for(let p of points){
            p.updateSmer(canvas.width, canvas.height);
            p.color="#34A9ED";
            quadT.insert(p)
            let dotBox = new AABB(p.x,p.y,p.r,height)
            let kandidati=quadT.inAABB(dotBox)
            for(let kand of kandidati) p.updateColor(kand); 
        }
    }
    if(!qOnT) quadT.show(canvas)

    for(let p of points){
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x,p.y,p.r,0,2*Math.PI)
        if(!seaT) ctx.fill()
        else ctx.strokeStyle = p.color
        ctx.stroke();
    }
    dis.innerHTML = sedajKrogi;
}

function showGrid(){qOnT=!qOnT}3

function showCircle(){seaT=!seaT}

function changeMax(){
    let max = document.getElementById("num")
    max_krogcov=max.value 
    
}

export function setMax(){
    max_krogcov = document.getElementById("max_krogcev").value
}


function resizeC() {
    canvas = document.getElementById("myCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}

setInterval(drawScean,1000/60);



