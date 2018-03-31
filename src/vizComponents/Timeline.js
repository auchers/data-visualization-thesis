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
            transitionStage: 0, // how we will transition through stages
        };

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
        this.renderBasicBarChart();
    }

    renderBasicBarChart(){
        // axis
        let g = this.container.append("g")
            // .attr("transform", "translate(" + padding.left + ", 0)");

        // data bind
        let rectsData = this.container.selectAll('.bar')
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
            .attr("dy", ".75em")
            .attr("y", -14)
            .attr("x", (yearScale(bins[0].x1) - yearScale(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return d.length; });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (this.props.height - padding.bottom) + ")")
            .call(d3.axisBottom(yearScale)
                .ticks(10)
                .tickFormat(d3.format(""))
            );

        this.rects.on('mouseover', (d) => {
            console.log(d.x0, d.x1);
        })
    }

    render() {
        return (
            <div>
                <button>Transition</button>
                <svg width={this.props.width} height={this.props.height} ref={el => this.container = d3.select(el)} id='timeline-container'>
                </svg>
            </div>
        );
    }
}

export default Timeline;
