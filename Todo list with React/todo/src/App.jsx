import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);


  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleDeleteAll = () => {
    setTodos([]);
    saveToLS([]);
  };

  const toggleFinished = (e) => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(newTodos);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Your Todos", 14, 16);


    const tableColumn = ["#", "Todo", "Completed"];
    const tableRows = [];
    todos.forEach((item, idx) => {
      tableRows.push([idx + 1, item.todo, item.isCompleted ? "Yes" : "No"]);
    });

    autoTable(doc,{
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("todos.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[60%]">
        <h1 className="font-bold text-center text-3xl">
          Deep-Task - Manage your todos at one place
        </h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input
              ref={inputRef}
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Write your task..."
              className="w-full rounded-full px-5 py-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && todo.length > 0) {
                  handleAdd();
                }
              }}
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 0}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center items-center my-4">
          <button
            onClick={handleDeleteAll}
            disabled={todos.length === 0}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full disabled:bg-red-300 mx-4"
          >
            Delete All Todos
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={todos.length === 0}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full disabled:bg-green-300 mx-4"
          >
            Download as PDF
          </button>
          <div className="flex items-center mx-4">
            <input
              className="my-0"
              id="show"
              onChange={toggleFinished}
              type="checkbox"
              checked={showFinished}
            />
            <label className="mx-2" htmlFor="show">
              Show Finished
            </label>
          </div>
        </div>

        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className={"todo flex my-3 justify-between"}>
                  <div className="flex gap-5">
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                      id=""
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(e, item.id);
                      }}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
