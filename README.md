# react-simple-file-input

Simple wrapper for the HTML input tag and HTML5 FileReader API

## Options

### readAs

react-simple-file-input expects a readAs option to indicate how the file should be read. Valid options are:

- 'text' [default] (Text)
- 'buffer' (Array Buffer)
- 'binary' (Binary String)
- 'dataUrl' (Data URL)

### Events

react-simple-file-input supports the following event handlers:

- onLoadStart
- onProgress
- onLoadEnd
- onLoad
- onAbort
- onError

Each receives the native event as the first argument, and the selected file object as the second.

### Children

All children passed to react-simple-file-input will be nested so when they are clicked the browser's file selection window opens.

## Examples

```javascript
var FileInput = require('react-simple-file-input');

var Component = React.createClass({

  render: function(){
    return(
      <div>
        To upload a file:
        
         <FileInput 
            readAs='binary'
            onLoadStart={this.showProgressBar}
            onLoad={this.handleFileSelected}
            onProgress={this.updateProgressBar}
            >
            Click Here       
         </FileInput>
      </div>
    );
  },
  
  showProgressBar: function(){
    this.setState({ progressBarVisible: true});
  },

  updateProgressBar: function(event){
    this.setState({
      progressPercent: (event.loaded / event.total) * 100
    });
  },

  handleFileSelected: function(event, file){
    this.setState({file: file, fileContents: event.target.result});
  }
});

```
