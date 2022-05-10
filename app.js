
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

        this.rectangles = [];
        this.rectangles.push(new Rect(this));

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

        this.docWidth = this.a3.width * this.scale;
        this.docHeight = this.a3.height * this.scale;

        // помещается ли документ на экране?
        if(this.docWidth >= $(".area").width()) this.canv.width = $(".area").width();
        else this.canv.width = this.docWidth;

        if(this.docHeight >= $(".area").height()) this.canv.height = $(".area").height();
        else this.canv.height = this.docHeight;

        this.paint();
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

        this.paint();

    }


    mousewheel(e) {

        let delta = e.originalEvent.wheelDeltaY;

        // на сколько можем скролать
        let xInterval = this.docWidth - this.canv.width;
        let yInterval = this.docHeight - this.canv.height;

        // можем ли скролать
        let ifx = this.canv.width < this.docWidth;
        let ify = this.canv.height < this.docHeight;

        // если уперлись в границы документа, то не даем скроллать
        if(e.ctrlKey) {

            // документ поместился на экране без прокрутки
            if(!ifx) return;

            if(delta > 0) {
                // контент уходит влево (положительная координата не может быть, уперлись в край)
                if( this.scrollX += delta > 0) this.scrollX = 0;
                else this.scrollX += delta;

            }
            else {
                // контент уходит вправо (отрицательная координата)
                if( Math.abs(this.scrollX += delta) > xInterval) this.scrollX = -1 * xInterval;
                else this.scrollX += delta;
            }

        }
        else {

            // документ поместился на экране без прокрутки
            if(!ify) return;

            if(delta > 0) {
                // контент уходит вниз (положительная координата не может быть, уперлись в край)
                if( this.scrollY += delta > 0) this.scrollY = 0;
                else this.scrollY += delta;

            }
            else {
                // контент уходит вверх (отрицательная координата)
                if( Math.abs(this.scrollY += delta) > yInterval) this.scrollY = -1 * yInterval;
                else this.scrollY += delta;
            }

        }

        this.paint();

    }


    paint() {

        this.clear();

        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 1;
        // this.ctx.strokeRect(this.scrollX, this.scrollY, 250*this.scale, 250*this.scale);
        // this.ctx.strokeRect(this.scrollX + 400*this.scale, this.scrollY + 400*this.scale, 250*this.scale, 250*this.scale);

        for(let i of this.rectangles) {
            this.ctx.strokeRect(
                this.scrollX + i.x * this.scale * this.mmToPx, 
                this.scrollY + i.y * this.scale * this.mmToPx, 
                i.width * this.scale * this.mmToPx, 
                i.height * this.scale * this.mmToPx
                );
        }
        // рассчитываем скроллбары

        // можем ли скролать
        let ifx = this.canv.width < this.docWidth - 1;
        let ify = this.canv.height < this.docHeight - 1;
        
        // % сколько занимает скроллбар от холста
        let xScroollRatio = this.canv.width / this.docWidth;
        let yScroollRatio = this.canv.height / this.docHeight;

        if(ifx) {
            $(".xscroll")
            .show()
            .css("width", this.canv.width * xScroollRatio)
            .css("left", -1 * this.scrollX / this.docWidth * this.canv.width);
        }
        else $(".xscroll").hide();

        if(ify) {
            $(".yscroll")
            .show()
            .css("height", this.canv.height * yScroollRatio)
            .css("top", -1 * this.scrollY / this.docHeight * this.canv.height);
        }
        else $(".yscroll").hide();
        
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
        // в миллиметрах значения
        this.width = 200;
        this.height = 100;
        this.x = 0;
        this.y = 0;
    }

}

let cm = new CanvasManager();














