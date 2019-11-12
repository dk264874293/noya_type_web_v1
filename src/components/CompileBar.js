import React from 'react';
import { Button, Icon,Input } from 'antd';
import PropTypes from 'prop-types';
const { TextArea } = Input;

class CompileBar extends React.Component{
  state = {
    status: false
  }


  textAreaChange = (event) => {
    this.setState({
      textAreaValue: event.target.value
    })
  }

  statusChange = () => {
    this.setState({
      status: !this.state.status
    })
  }

  render(){
    const { unscramble,date, user ,dataName, textAreaChange} = this.props;
    const {status} = this.state;
    let showText = ''
    let userDate = ''
    if(date && user){
      userDate = (
        <p style={{fontSize:12,color:'#939393',padding:'10px'}}>{user}修改与{date}</p>
      )
    }
    if(status){
      showText = (
        <div>
          <TextArea
            onChange={(ev) => {textAreaChange({
              unscramble:ev.target.value,date,user
            } ,dataName)}}
            value={unscramble}
            autosize={{ minRows: 3, maxRows: 6 }}
          />
          {userDate}
        </div>
       )
    }else{
      const unscrambleList = unscramble.split('\n');
      const unscrambleDom = unscrambleList.map((_,index)=> (
        <p style={{paddingLeft:10}} key={index}>{_}</p>
      ))
      showText = (
        <div>
          {unscrambleDom}
          {userDate}
        </div>

      )
    }
    return (
      <div style={{marginTop:28}}>
        <Button
          type="link"
          onClick={this.statusChange}
          style={{ padding:0 }}
        >
          <Icon type="form" style={{fontSize:18}} />
          编辑解读
        </Button>
        {showText}
      </div>
    )
  }
}

CompileBar.defaultProps = {
  unscramble: ''

};
CompileBar.propTypes ={
  unscramble:PropTypes.string,
  dataName:PropTypes.string,
  textAreaChange:PropTypes.func
}

export default CompileBar;
