import { format, isSameDay } from "date-fns";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../assets/todos.css";

interface ITodoItem {
    sequence: number;
    title: string;
    createdAt: number;

    isDone?: boolean;
    lastDoneAt?: number;
}

const DATE_TIME_FORMAT = "HH:mm dd-MM-yyyy";
const TIME_FORMAT = "HH:mm";

function Todos() {
    const cacheTodos = JSON.parse(sessionStorage.getItem("todos") || "[]") as ITodoItem[];
    const sequenceCountRef = useRef(Math.max(...cacheTodos.map((todo: ITodoItem) => todo.sequence), 0) + 1);
    const [items, setItems] = useState<ITodoItem[]>(cacheTodos);

    useEffect(() => {
        const storeToSessionStorage = () => {
            sessionStorage.setItem("todos", JSON.stringify(items));
        }
        window.addEventListener("beforeunload", storeToSessionStorage);

        return () => {
            window.removeEventListener("beforeunload", storeToSessionStorage);
        }
    }, [items])

    const addItem = (item: ITodoItem) => {
        setItems((items) => {
            const _items = Array.from(items);
            _items.push(item);
            return _items;
        });
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // @ts-ignore
        const title = e.target.title.value;

        if (title) {
            addItem({
                title,
                isDone: false,
                sequence: sequenceCountRef.current++,
                createdAt: new Date().getTime(),
            });
            // @ts-ignore
            e.target.reset();
        }

        return false;
    };

    const numberOfFinishedTodo = useMemo(() => {
        return items.filter((item) => item.isDone).length;
    }, [items]);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FAFAFA",
                height: "100vh",
            }}
        >
            <div
                style={{
                    width: "400px",
                    display: "flex",
                    gap: 4,
                    flexDirection: "column",
                }}
            >
                <span
                    style={
                        numberOfFinishedTodo > 0
                            ? { visibility: "visible", alignSelf: "flex-end" }
                            : { visibility: "hidden" }
                    }
                >
                    Đã hoàn thành {numberOfFinishedTodo} trên{" "}
                    {items.length || 0}
                </span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "600px",
                        boxShadow: "0px 0px 8px 0 #88888822",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            gap: 16,
                            background: "#f1f1f1",
                            overflow: "auto",
                            padding: "2rem",
                        }}
                    >
                        {items.map((item) => {
                            let displayTimeFormat = isSameDay(item.createdAt, new Date())
                                ? TIME_FORMAT
                                : DATE_TIME_FORMAT;
                            if (item.isDone && item.lastDoneAt) {
                                displayTimeFormat = isSameDay(item.lastDoneAt, new Date())
                                    ? TIME_FORMAT
                                    : DATE_TIME_FORMAT;
                            } 

                            return <div
                                key={item.sequence}
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    className="p-2"
                                    placeholder="Nhập nội dung ghi chú"
                                    style={{
                                        transform: "scale(1.5)",
                                    }}
                                    checked={item.isDone || false}
                                    onChange={(e) =>
                                        setItems((items) =>
                                            items.map((i) => {
                                                if ( item.sequence === i.sequence) {
                                                    i.isDone = e.target.checked;
                                                    i.lastDoneAt =
                                                        new Date().getTime();
                                                    return i;
                                                }
                                                return i;
                                            })
                                        )
                                    }
                                />
                                <div style={{
                                    flexGrow: 1 ,
                                    display: "flex",
                                    flexDirection: "column",
                                }}>
                                    <span
                                        style={
                                            item.isDone
                                                ? {
                                                      textDecoration:
                                                          "line-through",
                                                  }
                                                : { }
                                        }
                                    >
                                        {item.title}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "12px",
                                            color: "#6a6a6a",
                                        }}
                                    >
                                        {item.isDone && item.lastDoneAt
                                            ? (`Hoàn thành: ${format(
                                                  item.lastDoneAt,
                                                  displayTimeFormat,
                                              )}`)
                                            : format(
                                                  new Date(item.createdAt),
                                                  displayTimeFormat,
                                              )}
                                    </span>
                                </div>
                                <button
                                    className="remove"
                                    onClick={() =>
                                        setItems(
                                            items.filter((i) => i !== item)
                                        )
                                    }
                                >
                                    X
                                </button>
                            </div>
                        })}
                    </div>
                    <form
                        onSubmit={onSubmit}
                        style={{
                            display: "flex",
                            gap: 8,
                            padding: "1rem",
                            borderRadius: 8,
                            background: "#FAFAFA",
                        }}
                    >
                        <input
                            type="text"
                            name="title"
                            className="input"
                            style={{
                                flexGrow: 1,
                            }}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todos;
