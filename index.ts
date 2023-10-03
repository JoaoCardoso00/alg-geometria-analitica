import { createPrompt } from "bun-promptx";

let matrix = [
  // A  B  C  D  E  F  G  H  I  J
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0], // 2
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0], // 3
  [2, 2, 2, 2, 2, 2, 2, 0, 0, 0], // 4
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
  [0, 2, 2, 2, 2, 2, 0, 0, 0, 0], // 6
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 0], // 7
  [0, 2, 1, 0, 0, 0, 0, 0, 0, 0], // 8
];

class Node {
  constructor(
    public x: number,
    public y: number,
    public cost: number,
    public heuristic: number
  ) {}
}

const row = parseInt(
  createPrompt("insira a linha da posição inicial: ").value ?? ""
);
const column = parseInt(
  createPrompt("insira a coluna da posição inicial: ").value ?? ""
);

const row2 = parseInt(
  createPrompt("insira a linha da posição final: ").value ?? ""
);
const column2 = parseInt(
  createPrompt("insira a coluna da posição final: ").value ?? ""
);

if (matrix[row][column] === 2 || matrix[row2][column2] === 2) {
  console.log("Posição inicial ou final inválida");
  process.exit();
}

if (
  row < 0 ||
  row >= matrix.length ||
  column < 0 ||
  column >= matrix[0].length ||
  row2 < 0 ||
  row2 >= matrix.length ||
  column2 < 0 ||
  column2 >= matrix[0].length
) {
  console.log("Posição inicial ou final inválida");
  process.exit();
}

function blind_search(matrix: number[][]) {
  let start = [row, column];
  let end = [row2, column2];

  let openList: Node[] = [new Node(start[0], start[1], 0, 0)];
  let closedList: Node[] = [];
  let found = false;

  while (openList.length > 0) {
    openList.sort((a, b) => a.cost + a.heuristic - (b.cost + b.heuristic));
    const current = openList.shift();

    if (!current) continue;

    if (current.x === end[0] && current.y === end[1]) {
      found = true;
      console.log("Found the end position:", [current.x, current.y]);
      break;
    }

    const neighbors: Node[] = [
      new Node(
        current.x - 1,
        current.y,
        current.cost + 1,
        heuristic(current.x - 1, current.y, end)
      ),
      new Node(
        current.x + 1,
        current.y,
        current.cost + 1,
        heuristic(current.x + 1, current.y, end)
      ),
      new Node(
        current.x,
        current.y - 1,
        current.cost + 1,
        heuristic(current.x, current.y - 1, end)
      ),
      new Node(
        current.x,
        current.y + 1,
        current.cost + 1,
        heuristic(current.x, current.y + 1, end)
      ),
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 &&
        neighbor.x < matrix.length &&
        neighbor.y >= 0 &&
        neighbor.y < matrix[0].length &&
        matrix[neighbor.x][neighbor.y] !== 2 &&
        !closedList.some(
          (node) => node.x === neighbor.x && node.y === neighbor.y
        )
      ) {
        const existingNodeIndex = openList.findIndex(
          (node) => node.x === neighbor.x && node.y === neighbor.y
        );

        if (existingNodeIndex !== -1) {
          if (neighbor.cost < openList[existingNodeIndex].cost) {
            openList.splice(existingNodeIndex, 1);
            openList.push(neighbor);
          }
        } else {
          openList.push(neighbor);
        }
      }
    }

    closedList.push(current);
  }

  if (!found) {
    console.log("No solution");
  }
}

function heuristic(x: number, y: number, end: number[]): number {
  return Math.abs(x - end[0]) + Math.abs(y - end[1]);
}

blind_search(matrix);
