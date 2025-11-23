// Importing React hooks
// import { useState, useEffect, useRef } from "react";

// Importing Navbar (custom component stored in ./components folder)
// import Navbar from "./components/Navbar";

// Importing jsPDF (to generate PDF files in browser)
// import { jsPDF } from 'jspdf'

// Importing plugin autoTable for jsPDF (to create tables in the PDF)
// import { autoTable } from 'jspdf-autot
// able'
// Importing Edit icon from react-icons library
// import { FaEdit } from "react-icons/fa";
// Importing Delete icon from react-icons library
// import { AiFillDelete } from "react-icons/ai";

// Importing uuid library to generate unique IDs for todos
// import { v4 as uuidv4 } from "uuid";

// Importing CSS file for styling this component
import "./App.css";

function App() {
  // todo → holds the current input value (string that user types)
  // setTodo → function to update 'todo' state
  const [todo, setTodo] = useState("");

  // todos → array holding all todo objects
  // each todo object looks like: { id: "unique-id", todo: "task text", isCompleted: false }
  // setTodos → function to update 'todos' state
  const [todos, setTodos] = useState([]);

  // showFinished → boolean that controls whether completed tasks are visible in the list
  // setshowFinished → function to toggle this state
  const [showFinished, setshowFinished] = useState(true);

  // inputRef → reference to the input element, so we can programmatically focus it after actions
  const inputRef = useRef(null);

  // useEffect hook → runs when component loads (because dependency array is empty [])
  // Purpose: load todos from localStorage so that data persists after refresh
  useEffect(() => {
    let todoString = localStorage.getItem("todos"); // get "todos" key from localStorage
    if (todoString) { // if it exists
      let todos = JSON.parse(todoString); // convert JSON string back to array of objects
      setTodos(todos); // update todos state with saved list
    }
  }, []); // run only once, when App component first mounts


  // saveToLS → helper function to save todos into localStorage
  // newTodos is passed as parameter, so always updated list is saved
  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  // Delete ALL todos
  const handleDeleteAll = () => {
    setTodos([]); // clear todos in state
    saveToLS([]); // also clear in localStorage
  };

  // Toggle whether completed todos are visible or hidden
  const toggleFinished = (e) => {
    setshowFinished(!showFinished); // reverse the current boolean value
  };

  // Edit a todo
  const handleEdit = (e, id) => {
    // Find the todo object that matches given id
    let t = todos.filter((i) => i.id === id);
    // Put its text back into input field, so user can modify it
    setTodo(t[0].todo);
    // Remove the original version of this todo from list
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos); // update state with new list
    saveToLS(newTodos); // save updated list to localStorage
    // Focus input field again for smooth editing
    if (inputRef.current) inputRef.current.focus();
  };

  // Delete a SINGLE todo by its id
  const handleDelete = (e, id) => {
    // Keep only those todos which do not match the given id
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos); // update state
    saveToLS(newTodos); // save updated list
  };

  // Add a new todo to the list
  const handleAdd = () => {
    const newTodos = [
      ...todos, // copy existing todos
      { id: uuidv4(), todo, isCompleted: false } // add new todo with unique id, current text, default isCompleted false
    ];
    setTodos(newTodos); // update state with new list
    setTodo(""); // clear input field
    saveToLS(newTodos); // save updated list in localStorage
    // Focus back to input box so user can quickly type next task
    if (inputRef.current) inputRef.current.focus();
  };

  // Update todo input value as user types
  const handleChange = (e) => {
    setTodo(e.target.value); // store typed text in todo state
  };

  // Toggle checkbox (mark todo as completed or not)
  const handleCheckbox = (e) => {
    let id = e.target.name; // get todo id from checkbox "name" attribute
    // Find index of this todo in array
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos]; // make a copy of todos (to avoid mutating state directly)
    // Flip the value of isCompleted
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos); // update state
    saveToLS(newTodos); // save updated list
  };


  // Download todos list as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF(); // create new PDF document
    doc.text("Your Todos", 14, 16); // add a title at position (x=14, y=16)

    // Define table columns
    const tableColumn = ["#", "Todo", "Completed"];
    // Empty array to hold table rows
    const tableRows = [];
    // Loop over todos and push each into rows array
    todos.forEach((item, idx) => {
      tableRows.push([idx + 1, item.todo, item.isCompleted ? "Yes" : "No"]);
    });

    // Create table in PDF using autoTable
    autoTable(doc,{
      head: [tableColumn], // header row
      body: tableRows, // all rows
      startY: 20, // vertical start position (below title)
    });

    // Save the PDF as "todos.pdf"
    doc.save("todos.pdf");
  };

  return (
    <>
      {/* Navbar component */}
      <Navbar />

      {/* Main container with Tailwind CSS classes */}
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[60%]">
        
        {/* Page title */}
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>

        {/* Add Todo Section */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            {/* Input box for new todo */}
            <input
              ref={inputRef} // link input field with inputRef
              onChange={handleChange} // run when user types
              value={todo} // controlled input value
              type="text"
              className="w-full rounded-full px-5 py-1"
              // If user presses Enter key, add todo
              onKeyDown={(e) => {
                if (e.key === "Enter" && todo.length > 0) {
                  handleAdd();
                }
              }}
            />
            {/* Save button */}
            <button
              onClick={handleAdd}
              disabled={todo.length <= 0} // disabled if input is empty
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        {/* Control buttons section */}
        <div className="flex w-full justify-center items-center my-4">
          {/* Delete All Todos Button */}
          <button
            onClick={handleDeleteAll}
            disabled={todos.length === 0} // disabled if no todos
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full disabled:bg-red-300 mx-4"
          >
            Delete All Todos
          </button>
          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={todos.length === 0} // disabled if no todos
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full disabled:bg-green-300 mx-4"
          >
            Download as PDF
          </button>
          {/* Checkbox: Show Finished */}
          <div className="flex items-center mx-4">
            <input
              className="my-0"
              id="show"
              onChange={toggleFinished} // toggles showFinished state
              type="checkbox"
              checked={showFinished} // controlled checkbox
            />
            <label className="mx-2" htmlFor="show">
              Show Finished
            </label>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>

        {/* Todos List Section */}
        <div className="todos">
          {/* If no todos exist, show message */}
          {todos.length === 0 && <div className="m-5">No Todos to display</div>}

          {/* Map through todos array and render each */}
          {todos.map((item) => {
            return (
              // Only show todo if showFinished is true OR todo is not completed
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className={"todo flex my-3 justify-between"}>
                  
                  {/* Left side: checkbox + todo text */}
                  <div className="flex gap-5">
                    <input
                      name={item.id} // store id in name attribute
                      onChange={handleCheckbox} // toggle complete status
                      type="checkbox"
                      checked={item.isCompleted} // checkbox status = todo.isCompleted
                    />
                    {/* Apply line-through style if completed */}
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>

                  {/* Right side: Edit + Delete buttons */}
                  <div className="buttons flex h-full">
                    {/* Edit button */}
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <FaEdit />
                    </button>
                    {/* Delete button */}
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

// Exporting App component so it can be used in index.js
export default App;
