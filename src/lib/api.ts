"use server";

import { Todo } from "~/types";

function createStorage() {
  const storage = new Map<string, any>([
    ["todos:counter", 0],
    ["todos:data", []],
  ]);

  return {
    getItem(key: string) {
      return storage.get(key);
    },
    getItems(keys: string[]) {
      return keys.map((key) => {
        const value = storage.get(key);
        return { value };
      });
    },
    setItem(key: string, value: any) {
      storage.set(key, value);
      return Promise.resolve();
    },
  };
}

const storage = createStorage();

export async function getTodosFn() {
  return (await storage.getItem("todos:data")) as Todo[];
}
export async function addTodoFn(formData: FormData) {
  const title = formData.get("title") as string;
  const [{ value: todos }, { value: index }] = storage.getItems([
    "todos:data",
    "todos:counter",
  ]);

  storage.setItem("todos:data", [
    ...(todos as Todo[]),
    { id: index as number, title, completed: false },
  ]);
  storage.setItem("todos:counter", (index as number) + 1);
}
export async function removeTodoFn(id: number) {
  const todos = (await storage.getItem("todos:data")) as Todo[];
  await storage.setItem(
    "todos:data",
    todos.filter((todo) => todo.id !== id)
  );
}
export async function toggleTodoFn(id: number) {
  const todos = (await storage.getItem("todos:data")) as Todo[];
  await storage.setItem(
    "todos:data",
    todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    })
  );
}
export async function editTodoFn(id: number, formData: FormData) {
  const title = String(formData.get("title"));
  const todos = (await storage.getItem("todos:data")) as Todo[];
  await storage.setItem(
    "todos:data",
    todos.map((todo) => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    })
  );
}
export async function clearCompletedFn() {
  const todos = (await storage.getItem("todos:data")) as Todo[];
  await storage.setItem(
    "todos:data",
    todos.filter((todo) => !todo.completed)
  );
}
export async function toggleAllFn(completed: boolean) {
  const todos = (await storage.getItem("todos:data")) as Todo[];
  await storage.setItem(
    "todos:data",
    todos.map((todo) => ({ ...todo, completed }))
  );
}
