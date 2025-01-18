import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);

  // Styles object
  const styles = {
    container: {
      padding: "2rem",
      maxWidth: "1000px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
      outline: "none",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      margin: "10px 5px",
      transition: "background-color 0.3s ease",
    },
    fetchButton: {
      backgroundColor: "#2196F3",
      color: "white",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      margin: "10px 5px",
      transition: "background-color 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    },
    th: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "15px",
      textAlign: "left",
    },
    td: {
      padding: "12px 15px",
      borderBottom: "1px solid #ddd",
    },
    actionButton: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      margin: "0 5px",
    },
    editButton: {
      backgroundColor: "#FFC107",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#F44336",
      color: "white",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "2rem",
      fontSize: "2.5rem",
    },
  };

  // Add data to the backend(Firebase) using axios
  async function addData() {
    try {
      const newUser = { name, email, phone };
      await axios.post(
        "https://abcd-e8402-default-rtdb.firebaseio.com/users.json",
        newUser
      );
      fetchUsers();
      setEmail("");
      setName("");
      setPhone("");
      setEditId(null);
    } catch (error) {
      console.log("Fails to post data in Firebase,", error);
    }
  }

  async function fetchUsers() {
    const response = await axios.get(
      "https://abcd-e8402-default-rtdb.firebaseio.com/users.json"
    );
    const fetchedUsers = [];
    for (let key in response.data) {
      fetchedUsers.push({ id: key, ...response.data[key] });
    }
    setUsers([...fetchedUsers]);
  }

  async function deleteUser(id) {
    try {
      await axios.delete(
        `https://abcd-e8402-default-rtdb.firebaseio.com/users/${id}.json`
      );
      fetchUsers();
    } catch (error) {
      console.log("Fails to handle Delete operation : ", error);
    }
  }

  function editUser(id) {
    const user = users.find((user) => user.id === id);
    setEditId(id);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  }

  async function updateUser() {
    const updateUser = { name, email, phone };
    await axios.patch(
      `https://abcd-e8402-default-rtdb.firebaseio.com/users/${editId}.json`,
      updateUser
    );
    fetchUsers();
    setEmail("");
    setName("");
    setPhone("");
    setEditId(null);
  }

  return (
    <>
      <h1 style={styles.title}>User Management</h1>
      <div style={styles.container}>
        <input
          type="text"
          placeholder="Enter Name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Enter Email..."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Contact Number"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          style={styles.input}
        />
        <button onClick={editId ? updateUser : addData} style={styles.button}>
          {editId ? "Update user" : "Add user"}
        </button>

        <button onClick={fetchUsers} style={styles.fetchButton}>
          Fetch Data
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name 📛</th>
              <th style={styles.th}>Email 📧</th>
              <th style={styles.th}>Contact No. 🤳</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => editUser(user.id)}
                    style={{ ...styles.actionButton, ...styles.editButton }}
                  >
                    Edit 🖊️
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    Remove 🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
