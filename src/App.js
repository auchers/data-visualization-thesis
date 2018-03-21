import React from "react";
import ReactDOM from "react-dom";

import './css/style.css'; // Import CSS -> ADDED IN THIS STEP



const App = () => {
    return (
        <div>
        <p>React here!</p>
    </div>
);
};
export default App;
ReactDOM.render(<App />, document.getElementById("app"));