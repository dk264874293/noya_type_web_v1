import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import PropTypes from 'prop-types';
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
// import { Empty } from 'antd';

class GraphBar extends React.PureComponent{

  componentDidMount() {
  }

  render(){
    const { height,width,chartsData,chartsOption } = this.props;
    var graph = chartsData;
    const { triangle,fontSize,weight } = chartsOption
    var categories = [];
    for (var i = 0; i < 12; i++) {
        categories[i] = {
            name: '类目' + i
        };
    }
    graph.links.forEach(function (node) {
      node.value = Math.random() * 100
    });
    graph.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = Math.random() * 20;
        node.value = node.symbolSize;
        node.category = node.attributes.modularity_class;
        // Use random x, y
        node.x = node.y = null;
        node.draggable = true;
    });
    console.log(graph)
    const option = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animation: false,
        series : [
            {
              name: 'Les Miserables',
              type: 'graph',
              layout: 'force',
              data: graph.nodes,
              focusNodeAdjacency: true,
              force:{
                repulsion: 99
              },
              label:{
                show:true
              },
              // repulsion:9999999999,
              // edgeLength:99999,
              links: graph.links.map(item => ({
                ...item,
                // symbol:['none','triangle'],
                lineStyle:{
                  width: item.value / 50
                },


              })),
              categories: categories,
              symbol:'circle',
              emphasis: {
                lineStyle: {
                    width: 10
                }
              }
            }
        ]
    };

    return (
      <ReactEchartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        style={{ height: height, width: width }}
        className="react_for_echarts"
      />
    );
  }

}


GraphBar.defaultProps = {
  height: '600px',
  width: '100%',
  chartData: []
};
GraphBar.propTypes ={
  height:PropTypes.string,
  width:PropTypes.string,
  chartData:PropTypes.array,
  wordCloudClick:PropTypes.func
}

export default GraphBar;
