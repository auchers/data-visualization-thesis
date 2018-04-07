import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

// Page Variables
let padding = {top: 10, bottom: 30, left: 30, right: 30};

// D3 Globals
let countScale = d3.scaleLinear();
let yearScale = d3.scaleLinear();
let bins;
let year_aggregates = [];

class Timeline extends Component {
    constructor(props){
        super(props);
        this.state =  {
            currentTransition: 3, // how we will transition through stages
            transitions: [
                {"stage":0,
                    "text":"Add SVG cover to Map",
                    "function": () => {console.log('no function yet')},},
                {"stage":1,
                    "text":"Pull Map Up and animate dots down",
                    "function": () => {console.log('no function yet')},},
                {"stage":2,
                    "text":"Form Histogram",
                    "function": () => {this.undoRotateHistogram()},},
                {"stage":3,
                    "text":"Rotate Histogram",
                    "function": () => {this.rotateHistogram()},},
                {"stage":4,
                    "text":"Smooth Out Histogram to be Continuous",
                    "function": () => {console.log('no function yet')},},
            ],
        };
        this.handleTransition = this.handleTransition.bind(this);
        this.rotateHistogram = this.rotateHistogram.bind(this);

    }

    componentWillMount(){
        console.log('all props:', this.props);

        // process data
        // group by years to get agg counts
        year_aggregates = _.chain(this.props.buildings)
            .groupBy((building) => {return building.properties.YearBuilt; })
            .map((buildings, year) => {
                return {
                    year: +year,
                    count: buildings.length,
                    buildings: buildings,
                }
            }).filter((map) => {return map.year > 0 && map.year < 2020 })
            .sortBy((map) => {return map.year })
            .value();

        // TODO: decide whether we need this structure - if not change yearScale domain to work without it
        yearScale.range([padding.left , this.props.width - padding.right])
            .domain([year_aggregates[0].year, year_aggregates[year_aggregates.length - 1].year]);

        bins = d3.histogram()
            .value(d => d.properties.YearBuilt)
            .domain(yearScale.domain())
            .thresholds(yearScale.ticks(20)) // breaks domain into 10 year bins
            (this.props.buildings);

        countScale.range([this.props.height - 1.5*padding.bottom, padding.top])
            .domain([0, d3.max(bins, (d) => {return d.length;})]);

        console.log('bins', bins);
    }

    componentDidMount(){
        this.container.append('g').attr('class', 'histogram');
        this.renderBasicBarChart();
    }

    renderBasicBarChart(){
        // axis
        this.axis = this.container.append("g").attr('class', 'axis')
            // .attr("transform", "translate(" + padding.left + ", 0)");

        this.hist = this.container.select('.histogram');
        // data bind
        let rectsData = this.hist.selectAll('.bar')
            .data(bins);

        //exit
        rectsData.exit().remove();

        //enter and update
        this.rects = rectsData.enter()
            .append('g')
            .attr('class', 'bar')
            .attr('class', d => d.x0 + '-' + d.x1)
            .attr('transform', d => {return "translate(" + yearScale(d.x0) + ',' + countScale(d.length) + ")"; })

        this.rects.append('rect')
            .attr('x', 1)
            .attr('width', (yearScale(bins[1].x1) - yearScale(bins[1].x0)) - 2 )
            .attr('height', d => {return countScale.range()[0] - countScale(d.length)} )

        this.rects.append("text")
            .attr('class', 'hist-label')
            .attr("dy", ".75em")
            .attr("y", -14)
            .attr("x", (yearScale(bins[0].x1) - yearScale(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return d.length; });

        this.axis.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (this.props.height - padding.bottom) + ")")
            .call(d3.axisBottom(yearScale)
                .ticks(10)
                .tickFormat(d3.format(""))
            );

        // this.rects.on('mouseover', (d) => {
            // console.log(d.x0, d.x1);
        // })
    }
    // TODO:  make this mode declarative
    handleTransition(stage = this.state.currentTransition){
        console.log('handlingTransition');
        let currentTransition = stage + 1;
        this.state.transitions[stage].function();
        this.setState({currentTransition});
    }

    rotateHistogram() {
        console.log('rotating histogram');
        // let rotateTransform = d3.svg.transform().rotate(90).translate(25, 50);
        this.hist
            .style('transform-origin', 'center')
            .style('transition-duration', '3s')
            .style('transform', `rotate(90deg) translate(${this.props.height/2}px,${this.props.width/4}px `)

        // this.hist.classed('rotated-hist', true);
        // d3.selectAll('.hist-label').classed('rotated-hist', true);
        // this.axis.classed('rotated-hist', true).selectAll('text').classed('rotated-hist', true);
    }

    undoRotateHistogram(){
        //clear previous rotations
        // d3.selectAll('.rotated-hist')
        this.hist.style('transform', 'none')
    }

    render() {
        let curStage = this.state.currentTransition,
            prevStage = (this.state.currentTransition > 1) ?  this.state.currentTransition - 2 : 0;

        return (
            <div className='viz-wrapper'>
                <button onClick={() => this.handleTransition(prevStage)}>Back</button>
                <button onClick={() => this.handleTransition()}>
                    {this.state.transitions[curStage].text}</button>
                <svg width={this.props.width} height={this.props.height}
                     ref={el => this.container = d3.select(el)} id='viz-svg'>
                </svg>
            </div>
        );
    }
}

export default Timeline;
