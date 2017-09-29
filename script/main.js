class Grid extends Array {
  constructor(width = 4, height = 4) {
    super(height)
      .fill('')
        .forEach(
          (val, index) => {
            this[index] = Array(width).fill(' ');
          }
        );
  }

  clear() {
    this.forEach(
      (r) => {
        r.fill(' ');
      }
    );
  }

  width() {
    return this[0].length;
  }

  height() {
    return this.length;
  }

  place(thing) {
    thing.positions.forEach(
      (posArr, index) => {
        if(posArr) {
          let [x, y] = posArr;
          this[y][x] = thing.tokens[index];
        }
      }
    );
  }

  toHTML() {
    return this.map(
      (row, yIn) => {
        let rowHTML = row
          .map( (cell, xIn) => `<div class="cell ${cell}" id="${yIn}-${xIn}"></div>` )
            .join('\n');

        return `<div class="row" id="row-${yIn}">\n${rowHTML}\n</div>`;
      }
    ).join('\n');
  }
}

class Snake {
  constructor(positions = [[20, 20]], direction = 'l') {
    this.positions = positions;
    this.tokens = Array(this.positions.length).fill('snake');
    this.direction = direction;
  }

  head() {
    return this.positions[0];
  }
  
  tail() {
    return this.positions[this.positions.length - 1];
  }

  grow() {
    this.positions.push(this.tail().map( v => v ));
    this.tokens.push('snake');
  }

  update() {
    let [x, y] = this.head();

    switch(this.direction) {
      case 'r': 
        this.positions.unshift([(x + 1), y]);
        this.tokens.unshift('snake');
        break;

      case 'l': 
        this.positions.unshift([(x - 1), y]);
        this.tokens.unshift('snake');
        break;

      case 'u':
        this.positions.unshift([x, (y - 1)]);
        this.tokens.unshift('snake');
        break;

      case 'd':
        this.positions.unshift([x, (y + 1)]);
        this.tokens.unshift('snake');
        break;

      default:
        let [xTemp, yTemp] = this.head();
        this.positions[0] = [yTemp, xTemp];
        break;
    }

    this.positions.pop();
    this.tokens.pop();
  }
}

class Fruit {
  constructor(positions = [[10, 10]]) {
    this.positions = positions;
    this.tokens = Array(this.positions.length).fill('fruit');
  }

  newPosition(array) {
    this.positions = [array];
  }

  location() {
    return this.positions[0];
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    let randPos = function randPos(grid) {
      let x;
      let y;
      do {
        x = Math.floor(Math.random() * grid.width());
        y = Math.floor(Math.random() * grid.height());
      } while (grid[y][x] !== ' ')
      return [x, y];
    }
    let board = document.getElementById('board');
    let width = 40;
    let height = 40;
    let keyJammed = false;
    let grid = new Grid(width, height);
    let snake = new Snake([[20, 10], [21, 10]]);
    let renderIID;
    grid.clear();
    grid.place(snake);
    let fruit = new Fruit([randPos(grid)]);
    grid.place(fruit);

    board.innerHTML = grid.toHTML();

    board.addEventListener('click',
      () => {
        if(!!renderIID) {
          clearInterval(renderIID);
          renderIID = undefined;
        } else {
          renderIID = setInterval(
            () => {
              let [snakeX, snakeY] = snake.head();
              let [fruitX, fruitY] = fruit.location();

              snake.update();
              keyJammed = false;

              if( (snakeX == fruitX)
                  && (snakeY == fruitY)
                ) {
                snake.grow();
                fruit.newPosition(randPos(grid));
              }

              grid.clear();
              grid.place(fruit);
              grid.place(snake);

              board.innerHTML = grid.toHTML();
            },
            100
          );
        };
      }
    );

    window.addEventListener('keydown',
      (event) => {
        if(!keyJammed) {
          switch(event.key) {
            case "ArrowUp":
              keyJammed = true;
              event.preventDefault();
              if(!['u', 'd'].includes(snake.direction)) snake.direction = 'u';
              break;
            case "ArrowRight":
              keyJammed = true;
              event.preventDefault();
              if(!['r', 'l'].includes(snake.direction)) snake.direction = 'r';
              break;
            case "ArrowLeft":
              keyJammed = true;
              event.preventDefault();
              if(!['r', 'l'].includes(snake.direction)) snake.direction = 'l';
              break;
            case "ArrowDown":
              keyJammed = true;
              event.preventDefault();
              if(!['u', 'd'].includes(snake.direction)) snake.direction = 'd';
              break;
            default: 
              break;
          }
        }
      }
    );
  }
)
