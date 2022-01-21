import React, { Component } from 'react';
import downIcon from '../../assets/icons/down_icon.svg'
import upIcon from '../../assets/icons/up_icon.svg'
import './GInput.scss'

// props 参数：
// --props 
// ------可选：source:Array [{val,text,checked:boolean}] | noDataDes className
// ------可选：onChange事件，通过事件回调获取select选择的值
// ------可选：rule:{ regx:RegExp | function, [callback: function, errorMsg: '', requiredRuleInit: boolean] } 验证规则
//------------------regx function返回true，或者正则test()返回true，则表示当前值符合规则，如果为false，则表示当前值有错误
//------------------requiredRuleInit 初始化数据的时候是否校验，默认true校验
class GSelect extends Component {
  constructor(props) {
    super();
    if (!window.GEelementIndex) {
      window.GEelementIndex = 1
    }
    let selectInitData = this.getInitData(props)
    let errMsg = ''
    let hasErrorFirst = false
    if (props.rule) {
      errMsg = props.rule.errorMsg || ''
      if (!(typeof props.rule.requiredRuleInit === 'boolean' && !props.rule.requiredRuleInit)) {
        // requiredRuleInit: 非false 进行校验
        hasErrorFirst = this.regxRule(props, selectInitData.value)
      }
    }
    this.state = {
      GEelementIndex: window.GEelementIndex++,
      source: props.source || [],
      noDataDes: props.noDataDes || '暂无数据',
      isDownHidden: true,
      onChange: props.onChange || null,
      valueText: selectInitData.valueText,
      value: selectInitData.value,
      checkIndex: selectInitData.checkIndex,
      stylePosDownListBox: {
        bottom: ''
      },
      hasError: hasErrorFirst,
      errorMsg: errMsg
    }
    this.handleSelectDown = this.handleSelectDownFn.bind(this)
    this.handleDropSelectClick = this.handleDropSelectClickFn.bind(this)
  }
  get isDownHidden() {
    const { isDownHidden } = this.state;
    console.log(`counter changed, new value: ${isDownHidden}`);
    return isDownHidden;
  }
  UNSAFE_componentWillMount () {}
  componentDidMount () {
    if(!window.cancelSelectPopFn) {
      window.cancelSelectPopFn = (event) => {
        let $target = event.target
        let classStr = $target.className
        if (classStr.indexOf('sel-down-arrow') > -1 || classStr.indexOf('select-box') > -1) {
          return false
        }
        else if (classStr.indexOf('g-input') > -1 || classStr.indexOf('g-input-box') > -1) {
          if($target.getAttribute('data-select')||($target.firstChild && $target.firstChild.getAttribute('data-select'))) {
            return false
          }
        }
        console.log('触发了GSelect监听的body点击事件。')
        this.closeDropDown()
      }
      // false是冒泡监听事件，true是捕获监听
      document.body.addEventListener('click', window.cancelSelectPopFn, false);
    }
  }
  closeDropDown ($downListBoxSelf) {
    this.setState({
      isDownHidden:true
    })
    let selectDownWrap = document.querySelectorAll('.down-list-box:not(.hidden)')
    if(selectDownWrap && selectDownWrap.length > 0) {
      for (let i = 0; i < selectDownWrap.length; i++) {
        if (selectDownWrap[i].className.indexOf('hidden') < 0 && selectDownWrap[i] !== $downListBoxSelf) {
          selectDownWrap[i].classList.add('hidden')
          // todo
          // 这种情况也应该初始化下拉框位置的，但是不能使用this太麻烦，暂时不处理
          // this.initDownBoxPos()
        }
      }
    }
  }
  handleSelectDownFn (event) {
    console.log('触发了Gselect点击事件。')
    event = event || window.event;
    let dropDownUl = document.querySelector(`#select-${this.state.GEelementIndex}>.down-list-box`);
    // 隐藏其他打开的下拉框
    this.closeDropDown(dropDownUl)
    //
    if (dropDownUl && dropDownUl.className.indexOf('hidden') > -1) {
      // 下拉框隐藏, 切换成显示
      if (event) {
        // 展示下拉框
        if (this.state.isDownHidden) {
          this.setState({
            isDownHidden: false
          })
        } else {
          // isDownHidden已经是false,但是下拉框却显示了，说明是body点击事件触发的 dropDownUl hidden
          dropDownUl.classList.remove('hidden')
        }
        // 计算下拉框位置
        let selectHeight = document.getElementById(`select-${this.state.GEelementIndex}`).clientHeight
        let sizeObj = {
          selectHeight:  selectHeight,
          topDistanceY: event.clientY - selectHeight,
          downDistanceY: window.innerHeight - event.clientY - selectHeight
        }
        let timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
          this.caculateDownBoxPos(sizeObj, dropDownUl)
        }, 0)
      }
      
    } else {
      // 下拉框显示, 切换成隐藏
      this.setState({
        isDownHidden: true
      })
      this.initDownBoxPos()
    }
    event.preventDefault();
    event.stopPropagation();
  }
  renderDownList () {
    return this.state.source.map((item, i) => {
      return (
        <li key={'sel' + window.GEelementIndex + '_' + i} data-i={i} data-val={item.val} className={i == this.state.checkIndex ? 'checked' : ''}>
          {item.text}
        </li>
      )
    })
  }
  getInitData(props) {
    let obj = {}
    let arr = props.source
    if(Array.isArray(arr)) {
      if (arr.length > 0) {
        let check = 0
        let hasCheck = false
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].val && arr[i].text && arr['checked']) {
            check = i
            hasCheck = true
            break
          }
        }
        obj = {
          valueText: arr[check].text || '',
          value: arr[check].val || '',
          checkIndex: hasCheck ? check : -1
        } 
      }
    } else {
      console.error('GSelect source data is Array, yours wrong.')
    }
    return obj
  }
  handleDropSelectClickFn (event) {
    event = event || window.event
    let tar = event.target
    if (tar.className.indexOf('checked') > -1) {
      return false
    }
    let obj = {
      valueText: tar.textContent || '',
      value: tar.getAttribute('data-val') || '',
      checkIndex: tar.getAttribute('data-i')
    }
    this.setState({
      valueText: obj.valueText,
      value: obj.value,
      checkIndex: obj.checkIndex
    })
    if(typeof this.state.onChange === 'function') {
      this.state.onChange(obj)
    }
  }
  initDownBoxPos () {
    if (this.state.stylePosDownListBox.bottom) {
      this.setState({
        stylePosDownListBox: {
          bottom: ''
        }
      })
    }
  }
  caculateDownBoxPos (sizeObj, dropDownBox) {
    dropDownBox = dropDownBox ? dropDownBox : document.querySelector(`#select-${this.state.GEelementIndex}>.down-list-box`);
    sizeObj.dropDownHeight = dropDownBox.clientHeight
    if (sizeObj.downDistanceY >= sizeObj.dropDownHeight) {
      return false
    } else if (sizeObj.topDistanceY >= sizeObj.dropDownHeight) {
      this.setState({
        stylePosDownListBox: {
          bottom: sizeObj.selectHeight + 'px'
        }
      })
    }
  }
  hasRule (props) {
    let flag = ''
    if (props.rule) {
      if (props.rule.regx instanceof RegExp) {
        flag = 'RegExp'
      }
      else if (typeof props.rule.regx === 'function') {
        flag = 'function'
      }
    }
    return flag
  }
  regxRule (props, expValue) {
    expValue = expValue || ''
    let error = false
    let ruleFlag = this.hasRule(props)
    if (ruleFlag) {
      let flag;
      if(ruleFlag === 'RegExp') {
        flag = new RegExp(props.rule.regx).test(expValue)
      }
      else if (ruleFlag === 'function') {
        flag = props.rule.regx(expValue)
      }
      if (!flag) {
        error = true
      }
      if (typeof props.rule.callback === 'function') {
        props.rule.callback(flag)
      }
    }
    return error
  }
  renderArrow(){
    return this.isDownHidden ? <img src={downIcon} /> : <img src={upIcon} />
  }
  render () {
    return (
      <div className={'select-outer ' + this.props.className + (this.state.hasError? ' error': '')} id={'select-' + this.state.GEelementIndex}>
        <div className='select-box' onClick={this.handleSelectDown}>
          <div className='g-input-box'>
            <input type='text' className='g-input' readOnly data-select='select' value={this.state.valueText}/>
          </div>
          <div className='sel-down-arrow'>
            {this.renderArrow()}
          </div>
        </div>
        <div className={this.state.isDownHidden ? 'down-list-box hidden' : 'down-list-box'}
             style={this.state.stylePosDownListBox.bottom ? this.state.stylePosDownListBox : {}}>
          {
            this.state.source.length > 0 ?
            (
              <ul className='data-ul' onClick={this.handleDropSelectClick}>
                { this.renderDownList() }
              </ul>
            )
            :
            (
              <p>{this.state.noDataDes}</p>
            )
          }
        </div>
        {
          this.state.hasError && (
            <div className='error-msg'>
              {this.state.errorMsg}
            </div>
          )
        }
      </div>
    )
  }
}
export default GSelect;