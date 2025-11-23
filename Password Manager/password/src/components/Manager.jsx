import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";
import Copy from "./Copy";
import Edit from "./Edit";
import Delete from "./delete";

const Manager = () => {
  const ref = useRef(null);
  const passwordRef = useRef(null);
  const [formPasswordVisible, setFormPasswordVisible] = useState(false);
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [visibleMap, setVisibleMap] = useState({}); // { id: true }

  useEffect(() => {
    const passwords = localStorage.getItem("passwords");
    if (passwords) setPasswordArray(JSON.parse(passwords));
  }, []);

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", { position: "top-right", autoClose: 2000 });
  };

  const showPassword = () => {
    if (!passwordRef.current) return;
    const isHidden = passwordRef.current.type === "password";
    // toggle the input type
    passwordRef.current.type = isHidden ? "text" : "password";
    // set state to whether password is now visible
    setFormPasswordVisible(!isHidden);
  };

  const toggleRowVisibility = (id) => {
    setVisibleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savePassword = () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const id = uuidv4();
      const newItem = { ...form, id };
      const next = [...passwordArray, newItem];
      setPasswordArray(next);
      localStorage.setItem("passwords", JSON.stringify(next));
      setform({ site: "", username: "", password: "" });
      toast("Password saved!", { position: "top-right", autoClose: 2000 });
    } else {
      toast.error("Error: fill all fields (min 4 chars)", { position: "top-right", autoClose: 2500 });
    }
  };

  const deletePassword = (id) => {
    const ok = confirm("Do you really want to delete this password?");
    if (!ok) return;
    const next = passwordArray.filter((i) => i.id !== id);
    setPasswordArray(next);
    localStorage.setItem("passwords", JSON.stringify(next));
    toast("Password deleted", { position: "top-right", autoClose: 2000 });
  };

  const editPassword = (id) => {
    const item = passwordArray.find((i) => i.id === id);
    if (!item) return;
    setform({ site: item.site, username: item.username, password: item.password });
    const next = passwordArray.filter((i) => i.id !== id);
    setPasswordArray(next);
    localStorage.setItem("passwords", JSON.stringify(next));
  };

  const handleChange = (e) => setform({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="p-3 md:mycontainer min-h-[88.2vh]">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">Your own Password Manager</p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />

          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />

            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span className="absolute right-2 top-1" onClick={showPassword}>
                <img
                  className="p-1 cursor-pointer"
                  width={26}
                  src={formPasswordVisible ? "/icons/eyecross.svg" : "/icons/eye.svg"}
                  alt="eye"
                />
              </span>
            </div>
          </div>

          <button onClick={savePassword} className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900">
            <span>Save</span>
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>

          {passwordArray.length === 0 && <div>No passwords to show</div>}

          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <a href={item.site} target="_blank" rel="noreferrer" className="truncate">
                          {item.site}
                        </a>
                        <button className="cursor-pointer p-1 ml-2" onClick={() => copyText(item.site)} title="Copy site">
                          <Copy width={22} height={22} stroke="#065f46" />
                        </button>
                      </div>
                    </td>

                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <span>{item.username}</span>
                        <button className="cursor-pointer p-1 ml-2" onClick={() => copyText(item.username)} title="Copy username">
                          <Copy width={22} height={22} stroke="#065f46" />
                        </button>
                      </div>
                    </td>

                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input readOnly value={item.password} type={visibleMap[item.id] ? "text" : "password"} className="rounded-full border border-green-500 p-2 px-3" />
                        <button onClick={() => toggleRowVisibility(item.id)} className="p-1 cursor-pointer" title="Show/Hide">
                          <img
                            src={visibleMap[item.id] ? "/icons/eyecross.svg" : "/icons/eye.svg"}
                            alt="toggle visibility"
                            width={22}
                            className="cursor-pointer"
                          />
                        </button>
                        <button className="p-1 cursor-pointer" onClick={() => copyText(item.password)} title="Copy password">
                          <Copy width={22} height={22} stroke="#065f46" />
                        </button>
                      </div>
                    </td>

                    <td className="py-2 border border-white text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button className="flex items-center justify-center cursor-pointer h-8 w-8 p-1" onClick={() => editPassword(item.id)} title="Edit">
                          <Edit />
                        </button>
                        <button className="flex items-center justify-center cursor-pointer h-8 w-8 p-1" onClick={() => deletePassword(item.id)} title="Delete">
                          <Delete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
