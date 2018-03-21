import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

class Timeline extends Component {
    constructor(props){
        super(props);

    }

    componentWillMount(){
        // process data
        // console.log(geoData);
    }

    componentDidMount(){
        this.renderCircles();
    }

    renderCircles(){
        console.log('rendering circles');
        this.container.selectAll('circles')
            .data(this.props.buildings)
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('cx', d => Math.random() * this.props.width )
            .attr('cy', d => Math.random() * this.props.height)
            .attr('fill', 'gray')
            .attr('opacity', '0.6')
    }

    render() {
        return (
            <svg width={this.props.width} height={this.props.height} ref={el => this.container = d3.select(el)} id='timeline-container'>
            </svg>
        );
    }
}

export default Timeline;
