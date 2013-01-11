function Cells() {
  this.element = null;
  this.container = null;
  this.cells = [ ];
  this.cellSize = 120;
  this.colsMin = 1;
  this.colsMax = 16;
  this.cols = 0;
  this.grid = [ ];
  this.gridMin = 0;
  this.gridMax = 0;

  for(var i in arguments[0]) {
    if (this[i] !== undefined) {
      this[i] = arguments[0][i];
    }
  }

  this.cols = Math.max(Math.min(Math.floor(this.element.offsetWidth / this.cellSize), this.colsMax), this.colsMin);
  this.container = document.createElement('div');
  this.container.className = 'cellContainer';
  this.element.appendChild(this.container);
}
Cells.prototype.add = function(cell) {
  this.cells.push(cell);

  cell.element = document.createElement('div');
  cell.element.link = cell;

  var position = this.calc(cell);
  cell.element.style.left = position.x + 'px';
  cell.element.style.top = position.y + 'px';

  if (cell.template && cellTemplates[cell.template] !== undefined) {
    var inner = cellTemplates[cell.template].constructor(cell);
    if (inner) {
      cell.element.appendChild(inner);
    }
  }

  this.container.appendChild(cell.element);

  this.container.style.height = Math.ceil((this.gridMax + 1) / this.cols) * this.cellSize + 'px';
}
Cells.prototype.sort = function() {
  this.cells.sort(function(a, b) {
    return a.rel - b.rel;
  });
}
Cells.prototype.resize = function(cols, cellSize) {
  if ((cols && this.cols != Math.max(Math.min(cols, this.colsMax), this.colsMin)) || (cellSize !== undefined && this.cellWidth != cellSize)) {
    if (cols) {
      this.cols = Math.max(Math.min(cols, this.colsMax), this.colsMin);
    }
    if (cellSize !== undefined) {
      this.cellSize = cellSize;
    }
    this.grid = [ ];
    this.gridMin = 0;
    this.gridMax = 0;

    for(var i = 0, len = this.cells.length; i < len; ++i) {
      var cell = this.cells[i];
      var item = cell.element;

      var position = this.calc(cell);
      cell.element.style.left = position.x + 'px';
      cell.element.style.top = position.y + 'px';
    }

    this.container.style.height = Math.ceil((this.gridMax + 1) / this.cols) * this.cellSize + 'px';
  }
}
Cells.prototype.calc = function(cell) {
  var x = 0;
  var y = 0;

  switch(cell.val) {
    case 1:
      cell.element.className = 'cell s1x1';

      var search = true, g = this.gridMin;
      while(search) {
        if (this.grid[g] === undefined) {
          this.grid[g] = cell;

          x = g % this.cols * this.cellSize;
          y = Math.floor(g / this.cols) * this.cellSize;

          this.gridMin = g;
          if (this.gridMax < g) {
            this.gridMax = g;
          }

          search = false;
        }
        ++g;
      }
      break;
    case 2:
      cell.element.className = 'cell s1x2';
      var search = true, g = this.gridMin;
      var gMinFound = false;
      while(search) {
        if (!gMinFound && this.grid[g] === undefined) {
          gMinFound = true;
          this.gridMin = g;
        }
        if (this.grid[g] === undefined && this.grid[g + this.cols] === undefined) {
          this.grid[g] = cell;
          this.grid[g + this.cols] = cell;

          x = g % this.cols * this.cellSize;
          y = Math.floor(g / this.cols) * this.cellSize;

          if (this.gridMax < g + this.cols) {
            this.gridMax = g + this.cols;
          }

          search = false;
        }
        ++g;
      }
      break;
    case 3:
      cell.element.className = 'cell s2x1';
      var search = true, g = this.gridMin;
      var gMinFound = false;
      while(search) {
        if (!gMinFound && this.grid[g] === undefined) {
          gMinFound = true;
          this.gridMin = g;
        }
        if ((g % this.cols) < (this.cols - 1) && this.grid[g] === undefined && this.grid[g + 1] === undefined) {
          this.grid[g] = cell;
          this.grid[g + 1] = cell;

          x = g % this.cols * this.cellSize;
          y = Math.floor(g / this.cols) * this.cellSize;

          if (this.gridMax < g + 1) {
            this.gridMax = g + 1;
          }

          search = false;
        }
        ++g;
      }
      break;
    case 4:
      cell.element.className = 'cell s2x2';
      var search = true, g = this.gridMin;
      var gMinFound = false;
      while(search) {
        if (!gMinFound && this.grid[g] === undefined) {
          gMinFound = true;
          this.gridMin = g;
        }
        if ((g % this.cols) < (this.cols - 1) &&
            this.grid[g] === undefined &&
            this.grid[g + 1] === undefined &&
            this.grid[g + this.cols] === undefined &&
            this.grid[g + this.cols + 1] === undefined) {

          this.grid[g] = cell;
          this.grid[g + 1] = cell;
          this.grid[g + this.cols] = cell;
          this.grid[g + this.cols + 1] = cell;

          if (this.gridMax < g + this.cols + 1) {
            this.gridMax = g + this.cols + 1;
          }

          x = g % this.cols * this.cellSize;
          y = Math.floor(g / this.cols) * this.cellSize;

          search = false;
        }
        ++g;
      }
      break;
  }

  return { x: x, y: y };
}

function cell() {
  this.val = 1.0;
  this.rel = 0;
  this.template = '';

  for(var key in arguments[0]) {
    this[key] = arguments[0][key];
  }
}

cellTemplates = { };
function cellTemplate(name, constructor) {
  this.name = name;
  this.constructor = constructor;
  cellTemplates[this.name] = this;
}