import React, { Component } from 'react';
import PropTypes from 'prop-types';

const READ_METHOD_ALIASES = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

const SUPPORTED_EVENTS = [
  'onLoadStart',
  'onLoadEnd',
  'onLoad',
  'onAbort',
  'onError'
];

const UNSUPPORTED_BY_INPUT = {
  readAs: true,
  abortIf: true,
  cancelIf: true,
  onCancel: true
};

class FileInput extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){

    if (window && !window.File || !window.FileReader) {
      console.warn(
        'Browser does not appear to support API react-simple-file-input relies upon'
      );
    }
  }

  handleChange(event){
    const {
      readAs, cancelIf, onCancel, onProgress, abortIf, onChange, multiple
    } = this.props;

    const { files } = event.target;

    if (onChange) {
      if (multiple) {
        onChange(files);
      } else {
        onChange(files[0]);
      }
    }

    if (readAs) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if(cancelIf && cancelIf(file)){
          if(onCancel){
            onCancel(file);
          }

          return;
        }

        const fileReader = new window.FileReader();

        for(let i = 0; i < SUPPORTED_EVENTS.length; i++){
          const handlerName = SUPPORTED_EVENTS[i];

          if (this.props[handlerName]) {
            fileReader[handlerName.toLowerCase()] = (fileReadEvent)=>{
              this.props[handlerName](fileReadEvent, file);
            };
          }
        }

        if (typeof abortIf !== 'undefined') {
          fileReader.onprogress = (event)=>{

            if (abortIf(event, file)) {
              fileReader.abort();
            } else if(onProgress){
              onProgress(event, file);
            }

          }
        } else if(onProgress) {
          fileReader.onprogress = onProgress;
        }

        fileReader[READ_METHOD_ALIASES[readAs]](file);
      }

    }

  }

  render() {
    const inputProps = {};

    for (let property in this.props) {
      if (this.props.hasOwnProperty(property) && !UNSUPPORTED_BY_INPUT[property]) {
        inputProps[property] = this.props[property];
      }
    }

    return(
      <input {...inputProps}
         type='file'
         ref={ (c) => this.inputField = c }
         onChange={ this.handleChange }
      />
    );
  }
}

FileInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,

  multiple: PropTypes.bool,

  readAs: PropTypes.oneOf( Object.keys(READ_METHOD_ALIASES) ),

  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func,
  onLoad: PropTypes.func,
  onAbort: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,

  cancelIf: PropTypes.func,
  abortIf: PropTypes.func
};

export default FileInput;
