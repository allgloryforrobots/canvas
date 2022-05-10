
// прямоугольник с заливкой
// ctx.fillStyle = 'silver';
// let x = 50;
// ctx.fillRect(x, 50, 100, 100);

// анимация через requesAnimationFrame
// setInterval(function() {
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, canv.width, canv.height);
//     ctx.fillStyle = 'silver';
//     ctx.fillRect(x++, 50, 100, 100);
// }, 10);


// прямоугольник линия
// ctx.strokeStyle = 'grey';
// ctx.lineWidth = 1;
// ctx.strokeRect(200, 200, 250, 250);

// круг
// x, y, r, базовый угл, сектор, по часовой
// ctx.arc(300, 300, 50, 0, Math.PI * 2, false);
// ctx.fill();

// масштабирование
// ctx.scale(2, 2);

// вращение градусы
// ctx.rotate(10 * Math.PI/180);

// фигура треугольник
// ctx.strokeStyle = 'grey';
// ctx.lineWidth = 5;

// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(25, 100);
// ctx.lineTo(75, 100);
// ctx.closePath();
// ctx.stroke();


// текст
// ctx.fillStyle = 'silver';
// ctx.font = '20px Georgia';
// ctx.fillText("Hello", 50, 50);


// градиент
// let grad = ctx.addLinearGradient(0, 0, 500, 0);
// grad.addColorStop('0', 'magenta');
// grad.addColorStop('.50', 'blue');
// grad.addColorStop('1', 'red');
// ctx.fillStyle = grad;

// let isMouseDown = false;

// canv.addEventListener('mousedown', () => isMouseDown = true);
// canv.addEventListener('mouseup', () => {
//     isMouseDown = false;
//     ctx.beginPath();
// });

// canv.addEventListener('mousemove', (e) => {

//     if(isMouseDown) {

//         ctx.lineWidth = 3 * 2;
//         ctx.lineTo(e.clientX, e.clientY);
//         ctx.stroke();

//         ctx.beginPath();
//         ctx.arc(e.clientX, e.clientY, 3, 0, Math.PI*2);
//         ctx.fill();

//         ctx.beginPath();
//         ctx.moveTo(e.clientX, e.clientY);
//     }
    
// });

// // сохранение
// document.addEventListener('keydown', (e) => {
//     if(e.keyCode == 83) {
//         // save S
//     }
//     if(e.keyCpde == 82) {
//         // replay R
//     }
//     if(e.keyCode == 67) clear();
// });

// function clear() {
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, canv.width, canv.height);

//     ctx.beginPath();
//     ctx.fillStyle = 'black';
// }

// картинка-подложка
// let img = new Image();
// const imageUrl = new URL(
//     '1.png',
//     import.meta.url
// );
// img.src = imageUrl;
// img.onload = function() {
//     // область вырезания из исходника, область вставки в канву
//     ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
// }

class CanvasManager {

    constructor() {

        this.canv = document.getElementById('canvas');
        this.ctx = this.canv.getContext('2d');

        $(window).on("resize", () => this.resize());

        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.isLeftMouseDown = false;
        this.isMiddleMouseDown = false;
        this.mod = "move";
        this.scale = 1;
        this.ctrlKey = false;

        this.stack = [];

        this.resize();
        this.init();

    }
    

    resize() {

        // сколько пикселей в 1мм
        this.mmToPx = $(".mm").height();

        // 297×420 мм
        this.a3 = {
            width: this.mmToPx * 420,
            height: this.mmToPx * 297,
        };

        this.docWidth = this.a3.width;
        this.docHeight = this.a3.height;

        this.canv.width = $(".area").width();
        this.canv.height = $(".area").height();

    }


    init() {

        $(this.canv).on('mousemove', (e) => {
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
        });

        $(this.canv).on('mousedown', (e) => {
            if(e.which == 1) this.isLeftMouseDown = true;
            if(e.which == 2) this.isMiddleMouseDown = true;
        });

        $(this.canv).on('mouseup', (e) => {
            if(e.which == 1) this.isLeftMouseDown = false;
            if(e.which == 2) this.isMiddleMouseDown = false;
        });

        $("#add").on("click",  () => this.mod = "add");
        $("#move").on("click",  () => this.mod = "move");

        $(this.canv).on("click", (e) => {
            let rect = new Rect(this);
            this.stack.push(rect);
        });

        $(this.canv).on("mousewheel", (e) => {
            e.preventDefault();
            this.mousewheel(e);
        });

        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.scrollX, this.scrollY, 250, 250);

    }


    mousewheel(e) {

        let dy = e.originalEvent.wheelDeltaY;
        let dx = e.originalEvent.wheelDeltaX;
        let aw = $(".area").width();
        let ah = $(".area").height();


        // если уперлись в границы документа, то не даем скроллать
        if(e.ctrlKey) {

            // документ поместился на экране без прокрутки
            if(this.docWidth <= aw) return;
            

            if(this.scrollX + dy >= this.docWidth) this.scrollX = ;
            else this.scrollX += dy;
        }
        else {
            // документ поместился на экране без прокрутки
            if(this.docHeight <= aw) return;

            if() this.scrollY = ;
            else this.scrollY += dy;
        }

        this.paint();

    }


    paint() {

        this.clear();

        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.scrollX, this.scrollY, 250, 250);

    };


    clear() {

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';

    }

}


class Rect {
    constructor(cm) {
        this.cm = cm;
        this.width = 200;
        this.height = 100;
    }

}

let cm = new CanvasManager();














