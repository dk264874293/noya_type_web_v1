import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { Empty } from 'antd';
import 'echarts-wordcloud';


interface IWordCloudBarProps {
  height:string
  width:string
  chartData:any[]
  wordCloudClick: () => void
}

const WordCloudBar = function(props:IWordCloudBarProps = {
  height: '600px',
  width: '100%',
  chartData: [],
  wordCloudClick: () => {}
}){

  const { height,width,chartData,wordCloudClick } = props;
    if(chartData.length === 0){
      return (<Empty style={{height:height,lineHeight:height,margin: 0 }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>)
    }
    const getOption = () => ({
      toolbox: {
          show: true,
          feature: {
              saveAsImage: {
                  show: true
              }
          }
      },

      textStyle: {
        normal: {
            color: function() {
                return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')';
            }
        },
        emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
        }
      },

      series: [{
          rotationRange:[0,0],
          name: '词云',
          type: 'wordCloud',
          size: ['100%', '100%'],
          textRotation: [0, 0, 0, 0],
          textPadding: 2,
          data: chartData
      }]
    });

    const onEvents = {
      click:wordCloudClick
    }


    return (
      <ReactEchartsCore
        echarts={echarts}
        option={getOption()}
        notMerge={true}
        style={{ height: height, width: width }}
        className="react_for_echarts"
        onEvents={onEvents}
      />
    );
}

export default WordCloudBar;
