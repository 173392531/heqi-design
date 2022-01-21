import React, { Component } from "react";
import GSelect from './GSelect.jsx'


class UseSelectPage extends Component {
  constructor(props) {
    super();
    this.state={
      form: {
        listArr: [
          {val: 'abc1', text: 'abc输入法1'},
          {val: 'abc2', text: 'abc输入法2'},
          {val: 'abc3', text: 'abc输入法3'},
          {val: 'abc4', text: 'abc输入法4'},
          {val: 'abc5', text: 'abc输入法5'},
          {val: 'abc6', text: 'abc输入法6'},
          {val: 'abc7', text: 'abc输入法7'},
          {val: 'abc8', text: 'abc输入法8'}
        ]
      },
      rules: {
        selectRule: {
          regx: function (val) {
            if (val !== null && val !== '' && val !== undefined) {
              return true
            } else {
              return false
            }
          },
          callback: function (flag) {
            console.log('pwdRule:', flag)
          },
          errorMsg: '该项为必选项'
        }
      }
    }
    this.handleInput123ChangeFn = this.handleInput123Change.bind(this)
  }
  UNSAFE_componentWillMount () {}
  componentDidMount () {}
  handleInput123Change (val) {
    console.log('handleInput123Change:', val)
  }
  render () {
    return (
      <div style={{'width':'300px'}}>
        <div style={{ zIndex: 999, width: '100%'}}>
          <div className="sel-1">
            <GSelect className="abc-sel" source={this.state.form.listArr}
                     rule={this.state.rules.selectRule}
                     onChange={this.handleInput123ChangeFn}></GSelect>
          </div>
          <div className="sel-1">
            <GSelect className="abc-sel" source={this.state.form.listArr} onChange={this.handleInput123ChangeFn}></GSelect>
          </div>
          <div className="sel-1">
            <GSelect className="abc-sel" source={[]}
                     rule={this.state.rules.selectRule}
                     onChange={this.handleInput123ChangeFn}></GSelect>
          </div>
        </div>
      </div>
    )
  }
}
export default UseSelectPage;