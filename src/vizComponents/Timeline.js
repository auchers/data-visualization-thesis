import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3_color from 'd3-scale-chromatic';
import * as metrics from '../helpers/metricsConfig'

// Page Variables
let padding = {top: 10, bottom: 30, left: 30, right: 30};
let delayUnit = 250;
let hist = {
    xScale: null,
    yScale: null,
    colorScale: null,
    bins: null,
    el: null,
    axis: null,
    positionRectsAndAxis(axisTicks = 4) {
        let el = this.el;
        el.selectAll('g.bar')
            .style('transition-duration', '3s')
            .style("transform", "translate(0px,0px)")
            .style('transform', d => {
                return "translate(" + this.xScale(d.x0) + 'px,' + this.yScale(d.length) + "px)"; });

        el.selectAll('rect')
            .style('transition-duration', '4s')
            .style('width', (this.xScale(this.bins[1].x1) - this.xScale(this.bins[1].x0)));

        this.axis.call(d3.axisBottom(this.xScale)
            .ticks(axisTicks)
            .tickFormat(d3.format(""))
        );
    },
    dissolveBars(){
        console.log('dissolving Bars');
        let el = this.el;
        let maxLength = this.yScale.domain()[1];

        let transition = (d, i) => {
            let timingFunction = 'ease-in-out';
            let delay = (i * delayUnit); // offset delay by bar index
            let adj = d.length / maxLength; // adjust duration by height of bar
            let duration = (delayUnit + (500 * adj) );
            return `all ${duration}ms ${timingFunction} ${delay}ms`
        };

        el.selectAll('g.bar')
            .style('transition', transition)
            .style('transform', d => {
                return "translate(" + this.xScale(d.x0) + 'px,' + this.yScale.range()[0] + "px)"; });

        el.selectAll('rect')
            .style('transition', transition)
            .style('height', 0)
    }
};

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
                    "function": () => {this.renderRightHist()},},
                {"stage":5,
                    "text":"Dissolve Bars",
                    "function": () => {this.dissolveBars()},},
            ],
        };

        this.handleTransition = this.handleTransition.bind(this);
        this.downScaleHistogram = this.downScaleHistogram.bind(this);
        this.renderRightHist = this.renderRightHist.bind(this);
        this.prepRightHistData = this.prepRightHistData.bind(this);
    }

    initializeHistObject(color = d3_color.interpolateBlues){
        return Object.assign({}, hist, {
            xScale: d3.scaleLinear(),
            yScale: d3.scaleLinear(),
            colorScale: d3.scaleSequential(color),
        });
    }

    componentWillMount(){
        console.log('all props:', this.props);
        //initialize left histogram object
        this.left = this.initializeHistObject();
        let curMetric = metrics[0]; //TODO replace other mentions with curMetric

        // process data
        let years = this.props.buildings.map (d => d.properties[curMetric.metric])
                .filter(d => { return d >= 1860 && d <= 2020});

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

        console.log('left bins', this.left.bins);
    }

    componentDidMount(){
        this.left.el = this.container.append('g').attr('class', 'left-histogram');
        this.renderFirstBarChart();
    }

    renderFirstBarChart(){
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
        this.left.positionRectsAndAxis(10);
    }

    handleTransition(stage = this.state.currentTransition){
        let currentTransition = stage + 1;
        this.state.transitions[stage].function();
        this.setState({currentTransition});
    }

    downScaleHistogram(side = 'left') {
        // update range of xscale
        this.left.xScale.range([padding.left, this.props.width/2 - padding.right]);

        // position elements
        this.left.positionRectsAndAxis();
    }

    dissolveBars(){
        this.left.dissolveBars();
    }

    prepRightHistData(){
        let curMetric = metrics[1];

        this.right = this.initializeHistObject(d3_color[curMetric.colorScheme]);

        //TODO figure out a way to generalize more -- LOTS of redundancy
        // process data
        let map = this.props.buildings.map (d => d.properties[curMetric.metric]);
            // .filter(d => { return d >= 1860 && d <= 2020});

        this.right.xScale.range([this.props.width/2 + padding.right, this.props.width - padding.right])
            .domain([d3.min(map), d3.max(map)]);

        // map darker colors to earlier years
        this.right.colorScale.domain([d3.max(map), d3.min(map)]);

        this.right.bins = d3.histogram()
            .value(d => d.properties[curMetric.metric])
            .domain(this.right.xScale.domain())
            .thresholds(this.right.xScale.ticks(20))
            (this.props.buildings); //TODO need to update this data to gradually filter data being shown

        this.right.yScale.range([this.props.height - 1.5*padding.bottom, padding.top])
            .domain([0, d3.max(this.right.bins, (d) => {return d.length;})]);

        console.log('right bins', this.right.bins)
        // console.log('left bins', this.left.bins);

    }

    renderRightHist(){
        this.prepRightHistData();
        this.right.el = this.container.append('g').attr('class', 'right-histogram');
        // leftAxis
        this.right.axis = this.container.append("g")
            .attr("class", "rightAxis rightAxis--x")
            .attr("transform", "translate(0, " + (this.props.height - padding.bottom) + ")")

        // data bind
        let rectsData = this.right.el.selectAll('.bar')
            .data(this.right.bins);

        //exit
        rectsData.exit().remove();

        //enter and update
        let rightRects = rectsData.enter()
            .append('g')
            .attr('class', d => d.x0 + '-' + d.x1)
            .classed('bar', true)
            .merge(rectsData);

        rightRects.append('rect')
            .attr('x', 1)
            .attr('height', d => {return this.right.yScale.range()[0] - this.right.yScale(d.length)} )
            // .attr('fill', d => {return this.right.colorScale(d.x0)})
            .attr('fill', 'none');

        // position elements
        this.right.positionRectsAndAxis();
    }

    render() {
        let curStage = this.state.currentTransition,
            prevStage = (this.state.currentTransition > 1) ?  this.state.currentTransition - 2 : 0;

        // make sure there is a next step
        function NextButton(props){
            if (props.nextStep){
                return <button onClick={() => props.handler()}>{props.nextStep.text}</button>
            }
                return <button>All Done!</button>
        }

        return (
            <div className='viz-wrapper'>
                {/*<button onClick={() => this.handleTransition(prevStage)}>Back</button>*/}
                <NextButton nextStep={this.state.transitions[curStage]} handler={this.handleTransition}/>
                <svg width={this.props.width} height={this.props.height}
                     ref={el => this.container = d3.select(el)} id='viz-svg'>
                </svg>
            </div>
        );
    }
}

export default Timeline;
