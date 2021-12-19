export class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.vx=Math.random()
        this.vy=Math.random()
        this.r = 12
        this.color= "#34A9ED";
    }

    updateSmer(width,navzdol){


        let speed =5
        
        if(this.x>=width-this.r){
            this.vx = -Math.abs(this.vx);
        }
        if(this.x<this.r){
            this.vx = Math.abs(this.vx);
        }
        if(this.y>=navzdol-this.r){
            this.vy = -Math.abs(this.vy);
        }
        if(this.y<this.r){
            this.vy = Math.abs(this.vy);
        }
        
        this.x+=speed*this.vx+Math.sin(Math.random())
        this.y+=speed*this.vy*Math.cos(Math.random())
    }

    intersects(point){
        return ((this.x-point.x)**2 + (this.y-point.y)**2) <= ((this.r+point.r) **2);
    }

    updateColor(point){
        if(point!=this && this.intersects(point)){
            this.color  = "#F85B37"
            point.color = "#F85B37"
        }
    }

}

export class AABB{
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }

    containsPoint(point){
        return (
               (point.x+point.r / 2 <= this.x + this.w)
            && (point.x+point.r / 2 >= this.x - this.w)
            && (point.y+point.r / 2 >= this.y - this.h)
            && (point.y+point.r / 2 <= this.y + this.h))
    }

    intersects(aabb){
        return (
               this.x < aabb.x + aabb.w
            && this.x + this.w > aabb.x
            && this.y < aabb.y + aabb.h
            && this.y + this.h > aabb.y
            )
    }
}

export class QuadTree{
    constructor(boundry,cap=4){
        this.boundry=boundry
        this.cap = cap
        this.points = []

        this.kvadranti=[]
    }

    divide(){
        let x = this.boundry.x
        let y = this.boundry.y

        let w=this.boundry.w/2;
        let h=this.boundry.h/2;

        let q1 = new AABB(x,y,w,h)
        let q2 = new AABB(x+w,y,w,h)
        let q3 = new AABB(x,y+h,w,h) 
        let q4 = new AABB(x+w,y+h,w,h)
        
        this.kvadranti=[
            new QuadTree(q1,this.cap),
            new QuadTree(q2,this.cap),
            new QuadTree(q3,this.cap),
            new QuadTree(q4,this.cap)
        ]
    }

    inAABB(AABB){
        const tocke = []
        if(this.boundry.intersects(AABB)) {
            for(let point of this.points){
                if(this.boundry.containsPoint(point)) {
                    tocke.push(point)
                }
            }

            if(this.kvadranti.length==0) return tocke

            tocke.push.apply(tocke,this.kvadranti[0].inAABB(AABB));
            tocke.push.apply(tocke,this.kvadranti[1].inAABB(AABB));
            tocke.push.apply(tocke,this.kvadranti[2].inAABB(AABB));
            tocke.push.apply(tocke,this.kvadranti[3].inAABB(AABB));
        }
        return tocke
    }

    insert(point){
        if(this.boundry.containsPoint(point)){
            if(this.points.length < this.cap && this.kvadranti.length == 0){
                this.points.push(point)
                return true;
            }

            if(this.kvadranti.length==0) this.divide()
            
            for(let i=0;i<4;i++) if(this.kvadranti[i].insert(point)) return true
        }
        return false
    }

    show(c){
        if(this.kvadranti.length!=0){
            this.kvadranti[0].show(c)
            this.kvadranti[1].show(c)
            this.kvadranti[2].show(c)
            this.kvadranti[3].show(c)
        }
        let ctx= c.getContext("2d")
        ctx.beginPath();
        ctx.rect(this.boundry.x,this.boundry.y,this.boundry.w,this.boundry.h)
        ctx.stroke();
    }
}
