const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const WALL = '#';
const CHARATER = '@';
const CHARATER_IN_END = '-'
const BOX_IN_END = "*";
const BOX = "$";
const END = '.';
const BACKGROUND = ' ';
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
const leverMap = lever.split(',');
var currenGameIndex = 0;
let main = $('#main');

const resetBtn = $('.reset-btn');
const slct = $('#slct')
const confirmBtn = $('.confirm-btn')

var curenGame = leverMap[currenGameIndex].split('\n');
$('.author-lever').innerHTML = `lever ${currenGameIndex + 1}`
const app = {
    // hàm render ra màn hình
    render: function () {
        // get hang vs cot
        var col, row;
        row = curenGame.length;
        col = curenGame[0].length
        curenGame.forEach(e => {
            if (e.length > col) col = e.length
        })

        // render
        var htmls = '<table  border="0" cellspacing="0" cellpadding="0">';
        for (var i = 0; i < row; i++) {
            htmls += '<tr>'
            for (var j = 0; j < col; j++) {
                htmls += `<td>`
                switch (curenGame[i][j]) {
                    case WALL:
                        htmls += `<img src="./accsest/img/wall.png" alt="">`
                        break;
                    case CHARATER:
                        htmls += `<img src="./accsest/img/charater.png" alt="">`
                        break;
                    case CHARATER_IN_END:
                        htmls += `<img src="./accsest/img/charater.png" alt="">`
                        break;
                    case BOX_IN_END:
                        htmls += `<img src="./accsest/img/box_in_end.png" alt="">`
                        break;
                    case BOX:
                        htmls += `<img src="./accsest/img/box.png" alt="">`
                        break;
                    case END:
                        htmls += `<img src="./accsest/img/end.png" alt="">`
                        break;
                    case BACKGROUND:
                        htmls += `<img src="./accsest/img/background.png" alt="">`
                        break;

                }
                htmls += `</td>`
            }
            htmls += '</tr>'

        }
        return main.innerHTML = htmls
    },
    curenGameData: function () {
        var endValue = 0;
        var boxInEndValue = 0;
        var boxValue = 0;
        var charaterRow = 0;
        var currenRow = 0;
        var charaterCol = 0;
        curenGame.forEach((r) => {
            endValue += r.split(END).length - 1
            endValue += r.split(BOX_IN_END).length - 1
            endValue += r.split(CHARATER_IN_END).length - 1

            boxValue += r.split(BOX_IN_END).length - 1
            boxValue += r.split(BOX).length - 1

            boxInEndValue += r.split(BOX_IN_END).length - 1

            let curenCol = r.indexOf(CHARATER);
            if (curenCol < 0) {
                curenCol = r.indexOf(CHARATER_IN_END);
            }
            if (curenCol >= 0) {
                charaterRow = currenRow;
                charaterCol = curenCol;
            }

            currenRow++
        })
        // đưa ra các phần data game
        return curenGameValue = {
            endValue: endValue,
            boxInEndValue: boxInEndValue,
            boxValue: boxValue,
            charaterRow: charaterRow,
            charaterCol: charaterCol
        }
    },

    // hàm xử lý khi ấn hướng đi
    handleEvent: function () {

        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    app.goTo(LEFT)
                    break;
                case 38:
                    app.goTo(UP)
                    break;
                case 39:
                    app.goTo(RIGHT)
                    break;
                case 40:
                    app.goTo(DOWN)
                    break;

            }
        }

        // khi click reset btn
        resetBtn.onclick = function () {
            app.resetClicked()
        }

        // khi click chọn level 
        confirmBtn.onclick = function () {
            app.renderSelectedLevel()
        }
    },
    //hàm xử lý resetGame
    resetClicked: function () {
        curenGame = leverMap[currenGameIndex].split('\n');
        app.render()
    },
    // render lại lever đã được chọn
    renderSelectedLevel: function () {
        currenGameIndex = slct.value - 1;
        $('.author-lever').innerHTML = `lever ${currenGameIndex + 1}`
        curenGame = leverMap[currenGameIndex].split('\n');
        app.render()
    },
    // hàm xử lý sau khi nhận hướng đi
    goTo: function (nav) {
        var x = this.curenGameData().charaterCol;
        var y = this.curenGameData().charaterRow;
        var xNext = 0;
        var yNext = 0;

        switch (nav) {
            case LEFT:
                xNext--
                break;
            case RIGHT:
                xNext++
                break;
            case DOWN:
                yNext++
                break;
            case UP:
                yNext--
                break;
        }


        // xet nhan vat di chuyen
        // nếu phía trước là background hoặc điểm cuối
        if (curenGame[y + yNext][x + xNext] === BACKGROUND ||
            curenGame[y + yNext][x + xNext] === END) {

            curenGame[y + yNext] = curenGame[y + yNext].substr(0, x + xNext) +
                (curenGame[y + yNext][x + xNext] === END ? CHARATER_IN_END : CHARATER) +
                curenGame[y + yNext].substr(x + xNext + 1)
            curenGame[y] = curenGame[y].substr(0, x) +
                (curenGame[y][x] === CHARATER_IN_END ? END : BACKGROUND) +
                curenGame[y].substr(x + 1);

            this.curenGameData().charaterCol = x + xNext;
            this.curenGameData().charaterRow = y + yNext;
            app.render()
        }

        // nếu điểm sau là box => xét điểm đằng sau box
        else if (
            curenGame[y + yNext][x + xNext] === BOX ||
            curenGame[y + yNext][x + xNext] === BOX_IN_END)
            if (
                curenGame[y + yNext * 2][x + xNext * 2] === BACKGROUND ||
                curenGame[y + yNext * 2][x + xNext * 2] === END
            ) {
                if (curenGame[y + yNext * 2][x + xNext * 2] === END) {
                    this.curenGameData().boxInEndValue++;
                }
                if (curenGame[y + yNext * 2][x + xNext * 2] === BOX_IN_END) {
                    this.curenGameData().boxInEndValue--;
                }

                //xét lại nhân vật và thùng
                curenGame[y] =
                    curenGame[y].substr(0, x) +
                    (curenGame[y][x] === CHARATER_IN_END ? END : BACKGROUND) +
                    curenGame[y].substr(x + 1);
                curenGame[y + yNext] =
                    curenGame[y + yNext].substr(0, x + xNext) +
                    (curenGame[y + yNext][x + xNext] === BOX_IN_END ? CHARATER_IN_END : CHARATER) +
                    curenGame[y + yNext].substr(x + xNext + 1);
                curenGame[y + yNext * 2] =
                    curenGame[y + yNext * 2].substr(0, x + xNext * 2) +
                    (curenGame[y + yNext * 2][x + xNext * 2] === END
                        ? BOX_IN_END : BOX) +
                    curenGame[y + yNext * 2].substr(x + xNext * 2 + 1);
                this.curenGameData().charaterCol = x + xNext;
                this.curenGameData().charaterRow = y + yNext;
                app.render();
                // nếu trường hợp win
                if (this.curenGameData().boxInEndValue === this.curenGameData().endValue) {
                    $('.toast-heading').innerHTML = 'Xin chúc mừng'
                    $('.toast-content').innerHTML = 'Nào chiến tiếp nào 💛'
                    $('.toast').classList.add('fadein');
                    setTimeout(function () {
                        $('.toast').classList.remove('fadein')
                    }, 2000);
                    currenGameIndex++;
                    $('.author-lever').innerHTML = `lever ${currenGameIndex + 1}`
                    curenGame = leverMap[currenGameIndex].split('\n');
                    app.render()
                }
            }
    },
    fadeOuttoast: function () {
        $('.toast').classList.remove('fadein')
    },
    start: function () {
        this.render()
        this.handleEvent()
        this.goTo()
    }
}

app.start()