import React, { Component } from 'react';
import ReactDOM from "react-dom";
import * as d3 from 'd3';
import _ from 'lodash';

//components
import Timeline from './vizComponents/Timeline'

import './css/style.css';
// import plutoData from './assets/data/output';
import plutoData from './assets/data/full_output';
import landUseMapping from './assets/data/landUseMapping';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            buildings: [],
            landUseMapping: {}
        };
    }

    componentWillMount(){
        // process data
        let buildings = plutoData;
        this.setState({buildings, landUseMapping});
    }

    componentDidMount(){
        // console.log(this.state.buildings);
    }

    render() {

        return (
            <div id='container'>
                <h2>Exploring the Built Infrastructure of NYC</h2>
                <Timeline {...styles.timeline} {...this.state}/>
            </div>
        );
    }
}


/// one bar component

const styles = {
    container: {
        width: 760,
        height: 1400,
    },
    timeline: {
        width: 760,
        height: 400,
    },
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));