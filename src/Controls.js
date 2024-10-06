import React, {useState} from "react";
import "./Controls.css";

export default function Controls({hab, setHab}) {
  return (
      <>
      <div className="controls">
        {/*<Switch isOn={hab} handleToggle={() => setHab(!hab)} colorOne="#59ff84" colorTwo="#bd2d38"/>*/}
        <div>
          <input checked={hab} onChange={() => setHab(!hab)} type="checkbox" id="hab_switch"/>
          <label htmlFor="hab_switch">Habitable Zone</label>
        </div>
        <button>Back to star</button>
      </div>
    </>
  );
}
