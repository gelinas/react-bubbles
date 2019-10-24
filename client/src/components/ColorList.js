import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  // console.log(colors);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setAdding(false);
    setEditing(true);
    setColorToEdit(color);
  };

  const addColor = () => {
    setEditing(false);
    setAdding(true);
    setColorToEdit(initialColor);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        console.log("put in ColorList response", res);
        axiosWithAuth()
          .get('/api/colors')
          .then(res => {
            console.log("get in ColorList response", res);
            updateColors(res.data);
          })
          .catch(err => console.log(err.response));
      })
      .catch(err => console.log(err.response));
  };

  const postAdd = e => {
    e.preventDefault();
    axiosWithAuth()
      .post(`/api/colors/`, colorToEdit)
      .then(res => {
        console.log("put in ColorList response", res);
        updateColors(res.data);
        setAdding(false);
        editColor(res.data[res.data.length-1]);
      })
      .catch(err => console.log(err.response));
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`)
      .then(res => {
        console.log("put in ColorList response", res);
        setEditing(false);
        axiosWithAuth()
          .get('/api/colors')
          .then(res => {
            console.log("get in ColorList response", res);
            updateColors(res.data);
          })
          .catch(err => console.log(err.response));
      })
      .catch(err => console.log(err.response));

  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} className="color-item">
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                  x
              </span>
              {" "}
              <span onClick={() => editColor(color)}>
                {color.color}
              </span>
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <div className="button-row">
        {adding 
          ? <button type="button" onClick={() => setAdding(false)}>cancel adding</button> 
          : <button type="button" onClick={addColor}>add color</button>}
        
      </div>
      
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {adding && (
        <form onSubmit={postAdd}>
          <legend>add color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setAdding(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
