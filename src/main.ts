import './style.css'
import p5 from 'p5';

export const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(400, 400);
    }

    p.draw = () => {
        p.background(220);
        p.ellipse(50,50,80,80);
    }
}

const appDiv = document.querySelector('#app');
if(appDiv) {
    new p5(sketch, appDiv as HTMLElement);
}