class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Placeable {
    constructor(positions = [[0, 0]]) {
        this.positions = positions;
    }
}

class Snake extends Placeable {
    constructor(positions = [[20, 20]]) {
        super(positions);
        this.direction = 'r';
        this.token = 'O';
    }
}

class Grid {
    constructor(width = 40, height = 40) {
        this.width = width;
        this.height = height;
        this.positions = Array(height).fill('').map(() => Array(width).fill(' '));
    }

    place(placeable) {
        placeable.positions.forEach(
            function (pos) {
                this.positions[pos[1]][pos[0]] = placeable.token;
            },
            this
        );
    }
}

class GridUI {
    constructor(width, height) {
        this.grid = new Grid(width, height);
    }

    toHTML() {
        return this.grid.positions.map(
            (rowArr, rIndex) => {
                let rowHTML = rowArr.map(
                    (cell, cIndex) => {
                        return `<div class="cell" id="${rIndex}-${cIndex}">${cell}</div>`;
                    }
                ).join('');
                return `<div class="row" id="row-${rIndex}">${rowHTML}</div>`;
            }
        ).join('');
    }
}

const render = function render(gridUI) {
    document
        .getElementById('board')
        .insertAdjacentHTML('afterbegin', gridUI.toHTML());
};

const isControl = function isControl(key) {
    return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key);
};

const handleControls = function handleControls(event) {
    console.log(event);
    let key = event.key;
    if(isControl(key)) event.preventDefault();
};


document.addEventListener(
    'DOMContentLoaded',
    function () {
        let gridUI = new GridUI(40, 40);
        let snake = new Snake([[20, 20], [21, 20]]);
        gridUI.grid.place(snake);
        render(gridUI);
        window.addEventListener('keydown', handleControls);
    }
);
