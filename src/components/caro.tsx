import React, { useEffect, useState } from "react";

const boardSize = 5;

function Button({ disabled, style = {}, children, onClick }) {
    return (
        <button
            style={{
                border: "none",
                width: 24,
                height: 24,
                cursor: "pointer",
                ...style
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

let turn = 0;
let x = -1,
    y = -1;
const initBoard = new Array(boardSize).fill([]).map((row) => {
    row = new Array(boardSize).fill(0);
    return row;
});

export default function CaroGame() {
    const [isGameStarted, setIsGameStarted] = useState(true);
    const [isCurrentXTurn, setisCurrentXTurn] = useState(true);
    const [tiles, setTiles] = useState(initBoard);
    const [winner, setWinner] = useState(null);

    const resetGame = React.useCallback(() => {
        turn = 0;
        x = -1;
        y = -1;
        setIsGameStarted(true);
        setisCurrentXTurn(true);
        setTiles(initBoard.map((row) => row.fill(0)));
        setWinner(null);
    }, []);

    useEffect(() => {
        if (x > -1 && y > -1) {
            turn++;
            if (turn >= 5) {
                // Column check
                let count = 1;
                let cursor = x - 1;
                while (cursor >= 0) {
                    if (tiles[cursor][y] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    cursor--;
                }

                cursor = x + 1;
                while (cursor < boardSize) {
                    if (tiles[cursor][y] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    cursor++;
                }

                // Row check
                count = 1;
                cursor = y - 1;
                while (cursor >= 0) {
                    if (tiles[x][cursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    cursor--;
                }

                cursor = y + 1;
                while (cursor < boardSize) {
                    if (tiles[x][cursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    cursor++;
                }

                // Diagonal check - left to right
                count = 1;
                let yCursor = y - 1;
                let xCursor = x - 1;
                while (xCursor >= 0 && yCursor >= 0) {
                    if (tiles[xCursor][yCursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    xCursor--;
                    yCursor--;
                }

                yCursor = y + 1;
                xCursor = x + 1;
                while (xCursor < boardSize && yCursor < boardSize) {
                    if (tiles[xCursor][yCursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }

                    xCursor++;
                    yCursor++;
                }

                // Diagonal check - right to left
                count = 1;
                yCursor = y + 1;
                xCursor = x - 1;
                while (xCursor >= 0 && yCursor < boardSize) {
                    if (tiles[xCursor][yCursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }
                    xCursor--;
                    yCursor++;
                }

                yCursor = y - 1;
                xCursor = x + 1;
                while (xCursor < boardSize && yCursor >= 0) {
                    if (tiles[xCursor][yCursor] === tiles[x][y]) {
                        count++;
                        if (count >= 3) {
                            setWinner(isCurrentXTurn ? 2 : 1);
                            return;
                        }
                    } else {
                        break;
                    }

                    xCursor++;
                    yCursor--;
                }
            }
        }
    }, [tiles, isCurrentXTurn]);

    useEffect(() => {
        if (winner) {
            setIsGameStarted(false);
        }
    }, [winner]);

    return (
        <div className="App">
            <div
                style={{
                    display: "flex",
                    gap: 4,
                    flexDirection: "column"
                }}
            >
                {tiles.map((row, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                gap: 4
                            }}
                        >
                            {row.map((tile, rowIndex) => {
                                if (tile === 1) {
                                    return (
                                        <Button
                                            key={index + rowIndex.toString()}
                                            style={{
                                                background: "#888888"
                                            }}
                                        >
                                            X
                                        </Button>
                                    );
                                }
                                if (tile === 2) {
                                    return (
                                        <Button
                                            key={index + rowIndex.toString()}
                                            style={{
                                                background: "#888888"
                                            }}
                                        >
                                            O
                                        </Button>
                                    );
                                }
                                return (
                                    <Button
                                        key={index + rowIndex.toString()}
                                        style={{
                                            background: "#aaaaaa"
                                        }}
                                        onClick={() => {
                                            // if (!isGameStarted) {
                                            //   return;
                                            // }
                                            x = index;
                                            y = rowIndex;
                                            if (isCurrentXTurn) {
                                                setTiles((tiles) => {
                                                    tiles[index][rowIndex] = 1;
                                                    return [...tiles];
                                                });
                                                setisCurrentXTurn((isCurrentXTurn) => false);
                                            } else {
                                                setTiles((tiles) => {
                                                    tiles[index][rowIndex] = 2;
                                                    return [...tiles];
                                                });
                                                setisCurrentXTurn((isCurrentXTurn) => true);
                                            }
                                        }}
                                    ></Button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {winner && <div>Winner is {winner === 1 ? "X" : "O"}</div>}
            <button onClick={resetGame}>Reset</button>
        </div>
    );
}
