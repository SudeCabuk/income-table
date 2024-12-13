import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  const [row, setRow] = useState([]);
  const [dbData, setDbData] = useState([]);
  const createRow = () => {
    setRow([
      ...row,
      { id: row.length + 1, receiptNo: "", description: "", price: "" },
    ]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/incomes")
      .then((response) => {
        setDbData(response.data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }, []);

  const deleteItem = (id) => {
    const updatedRow = row.filter((item) => item.id !== id);
    setRow(updatedRow);
  };

  const handleChange = (id, field, value) => {
    const updatedRow = row.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setRow(updatedRow);
  };

  const handleDbDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/incomes?id=${id}`)
      .then((response) => {
        axios
          .get("http://localhost:8080/api/incomes")
          .then((response) => {
            setDbData(response.data);
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
          });
      });
  };

  const handleSave = () => {
    axios
      .post("http://localhost:8080/api/incomes", row)
      .then((response) => {
        setRow([]);
        axios
          .get("http://localhost:8080/api/incomes")
          .then((response) => {
            setDbData(response.data);
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
          });
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="App">
      <div className="div-container">
        <h1 className="title">Şirket İçi Gelir Fiş Listesi</h1>
        <button onClick={createRow}>Add Row</button>
      </div>
      <table>
        <tr>
          <th>Receipt No</th>
          <th>Description</th>
          <th>Price</th>
          <th> </th>
        </tr>
        {dbData.map((val) => {
          return (
            <tr key={val.id}>
              <td>
                <input
                  type="number"
                  value={val.receiptNo}
                  onChange={(e) =>
                    handleChange(val.id, "receiptNo", e.target.value)
                  }
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  value={val.description}
                  onChange={(e) =>
                    handleChange(val.id, "description", e.target.value)
                  }
                  disabled
                />
              </td>
              <td>
                <input
                  type="number"
                  value={val.price}
                  onChange={(e) =>
                    handleChange(val.id, "price", e.target.value)
                  }
                  disabled
                />
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon"
                  onClick={() => handleDbDelete(val.id)}
                />
              </td>
            </tr>
          );
        })}
        {row.map((val) => {
          return (
            <tr key={val.id}>
              <td>
                <input
                  value={val.receiptNo}
                  onChange={(e) =>
                    handleChange(val.id, "receiptNo", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={val.description}
                  onChange={(e) =>
                    handleChange(val.id, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={val.price}
                  onChange={(e) =>
                    handleChange(val.id, "price", e.target.value)
                  }
                />
              </td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon"
                  onClick={() => deleteItem(val.id)}
                />
              </td>
            </tr>
          );
        })}
      </table>

      <button className="btn-1" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default App;
