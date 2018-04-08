import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3_color from 'd3-scale-chromatic';
import _ from 'lodash';

// Page Variables
let padding = {top: 10, bottom: 30, left: 30, right: 30};

let hist = {
    xScale: null,
    yScale: null,
    colorScale: null,
    bins: null,
    el: null,
    axis: null,
}

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
                    "function": () => {console.log('no function yet')},},
                {"stage":3,
                    "text":"Shrink Histogram To Left",
                    "function": () => {this.downScaleHistogram()},},
                {"stage":4,
                    "text":"Add New Right Axis",
                    "function": () => {console.log('no function yet')},},
            ],
        };

        this.handleTransition = this.handleTransition.bind(this);
        this.downScaleHistogram = this.downScaleHistogram.bind(this);
        this.initializeHistObjects = this.initializeHistObjects.bind(this);
    }

    initializeHistObjects(){
        this.left = Object.assign({}, hist, {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
            colorScale: d3.scaleSequential(d3_color.interpolateBlues),
        });

    }

    componentWillMount(){
        this.initializeHistObjects();
        console.log('all props:', this.props);

        // process data
        let years = this.props.buildings.map (d => d.properties.YearBuilt)
                .filter(d => { return d >= 1860 && d <= 2020})

        this.left.xScale.range([padding.left , this.props.width - padding.right])
            .domain([d3.min(years), d3.max(years)]);

        // map darker colors to earlier years
        this.left.colorScale.domain([d3.max(years) + 50, d3.min(years)]);

        this.left.bins = d3.histogram()
            .value(d => d.properties.YearBuilt)
            .domain(this.left.xScale.domain())
            .thresholds(this.left.xScale.ticks(20)) // breaks domain into 10 year bins
            (this.props.buildings);

        this.left.yScale.range([this.props.height - 1.5*padding.bottom, padding.top])
            .domain([0, d3.max(this.left.bins, (d) => {return d.length;})]);

        console.log('bins', this.left.bins);
    }

    componentDidMount(){
        this.left.el = this.container.append('g').attr('class', 'histogram');
        this.renderBasicBarChart();
    }

    renderBasicBarChart(){
        // leftAxis
        this.left.axis = this.container.append("g")
            .attr("class", "leftAxis leftAxis--x")
            .attr("transform", "translate(0," + (this.props.height - padding.bottom) + ")")

        // data bind
        let rectsData = this.left.el.selectAll('.bar')
            .data(this.left.bins);

        //exit
        rectsData.exit().remove();

        //enter and update
        let leftRects = rectsData.enter()
            .append('g')
            .attr('class', d => d.x0 + '-' + d.x1)
            .classed('bar', true)
            .merge(rectsData);

        leftRects.append('rect')
            .attr('x', 1)
            .attr('height', d => {return this.left.yScale.range()[0] - this.left.yScale(d.length)} )
            .attr('fill', d => {return this.left.colorScale(d.x0)})

        // position elements
        this.positionRectsAndAxis(this.left, 10);

        console.log('left histogram object', this.left);
    }

    handleTransition(stage = this.state.currentTransition){
        console.log('handlingTransition');
        let currentTransition = stage + 1;
        this.state.transitions[stage].function();
        this.setState({currentTransition});
    }

    downScaleHistogram(side = 'left') {
        console.log('downscaling histogram');

        // update range of xscale
        this.left.xScale.range([padding.left, this.props.width/2 - padding.right]);

        // position elements
        this.positionRectsAndAxis(this.left);

    }

    positionRectsAndAxis(hist, axisTicks = 4){
        let el = hist.el;
        el.selectAll('g.bar')
            .style('transition-duration', '3s')
            .style("transform", "translate(0px,0px)")
            .style('transform', d => {
                return "translate(" + this.left.xScale(d.x0) + 'px,' + this.left.yScale(d.length) + "px)"; });

        el.selectAll('rect')
            .style('transition-duration', '4s')
            .style('width', (this.left.xScale(this.left.bins[1].x1) - this.left.xScale(this.left.bins[1].x0)) - 2 )

        hist.axis.call(d3.axisBottom(this.left.xScale)
            .ticks(axisTicks)
            .tickFormat(d3.format(""))
        );
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
