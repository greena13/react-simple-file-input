import React from 'react';

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

const FileInput = React.createClass({
  propTypes: {
    readAs: React.PropTypes.oneOf(Object.keys(READ_METHOD_ALIASES)),
    onLoadStart: React.PropTypes.func,
    onLoadEnd: React.PropTypes.func,
    onLoad: React.PropTypes.func,
    onAbort: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onError: React.PropTypes.func,
    onProgress: React.PropTypes.func,
    cancelIf: React.PropTypes.func,
    abortIf: React.PropTypes.func
  },

  componentWillMount(){
    if (!window.FileReader) {
      console.warn(
          'Browser does not appear to support API react-simple-file-input relies upon'
      );
    }
  },

  handleChange(event){
    const {readAs, cancelIf, onCancel, onProgress, abortIf, onChange} = this.props;
    const file = event.target.files[0];

    if(onChange){
      onChange(file);
    }

    if(!readAs) {
      return;
    }

    const fileReader = new window.FileReader();

    if(cancelIf && cancelIf(file)){
      if(onCancel){
        onCancel(file);
      }

      return;
    }

    SUPPORTED_EVENTS
        .filter(handlerName => this.props.hasOwnProperty(handlerName))
        .forEach(handlerName => {
          fileReader[handlerName.toLowerCase()] = (fileReadEvent) => {
            this.props[handlerName](fileReadEvent, file);
          };
        });

    fileReader.onprogress = (event) => {
      if(abortIf && abortIf(event, file)) {
        fileReader.abort();
        return;
      }

      if(onProgress) {
        onProgress(event, file);
      }
    };

    const fileReaderMethod = READ_METHOD_ALIASES[readAs];
    fileReader[fileReaderMethod](file);
  },

  render() {
    return(
      <input {...this.props}
             type='file'
             onChange={this.handleChange} />
    );
  }
});

export default FileInput;
