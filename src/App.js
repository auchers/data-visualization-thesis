import React, { Component } from 'react';
import ReactDOM from "react-dom";
import * as d3 from 'd3';
import _ from 'lodash';

import './css/style.css'; // Import CSS -> ADDED IN THIS STEP
import geoData from '../nyc-data-playground/data/json/mn_features';

var width = 900;
var height = 1200;
var margin = {left: 100, right: 20, top: 100, bottom: 20};

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            buildings : [],
        };
    }

    componentWillMount(){
        // process data
        console.log(geoData);
    }

    render() {
        var props = {
            width, margin
        };

        return (
            <div className='App'>
                <h2>
                    Hi! This is my first app!
                </h2>
            </div>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));