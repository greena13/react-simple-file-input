# react-simple-file-input

Simple wrapper for the HTML input tag and HTML5 FileReader API

## Options

### readAs

react-simple-file-input expects a `readAs` option to indicate how the file should be read. Valid options are:

- 'text' (Text)
- 'buffer' (Array Buffer)
- 'binary' (Binary String)
- 'dataUrl' (Data URL)

By default the `readAs` option is `undefined`. If left undefined, the file will not be read from disk and only the `onChange` event will be triggered. 

### Events

react-simple-file-input supports the following event handlers:

#### FileReader events

- onLoadStart
- onProgress
- onLoadEnd
- onLoad
- onAbort
- onError

Each receives the native event as the first argument, and the selected file object as the second.

#### Custom events

- onChange
- onCancel

The `onChange` handler is called whenever the file is changed and occurs before the file is read from disk. It receives a `File` object as its only argument.

The `onCancel` handler receives the `File` object corresponding to the file the user attempted to read from the file system.

### Skipping file reads

If the `readAs` option is not specified, the file will not be read from disk and only `onChange` will be triggered. All other events as skipped.

### Aborting \& cancelling file reads

react-simple-file-input provides two props for canceling and aborting file reads

#### Cancelling the file read before it begins

The `cancelIf` prop accepts a function that receives the `File` object. If the function is defined and returns a truthy value then the file upload will be cancelled before it begins reading from the filesystem and the `onCancel` handler is called with the file object. 
 
### Aborting the file read once it has begun

If defined the `abortIf` function is executed just before every time the `onProgress` handler is called. It is passed the native event and the file object as arguments, respectively and if it returns a truthy value it aborts the file read and calls the `onAbort` handler. The `onProgress` event is *not* called if the file read aborts. 
 
### Children

All children passed to react-simple-file-input will be nested so when they are clicked the browser's file selection window opens.

## Examples

```javascript
var FileInput = require('react-simple-file-input');

var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

function fileIsIncorrectFiletype(file){
  if (allowedFileTypes.indexOf(file.type) === -1) {
    return true;
  } else {
    return false;
  }
}

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
            cancelIf={fileIsIncorrectFiletype}
            onCancel={this.showInvalidFileTypeMessage}
            abortIf={this.cancelButtonClicked}
            onAbort={this.resetCancelButtonClicked}
            >
            Click Here       
         </FileInput>
      </div>
    );
  },
  
  cancelButtonClicked: function(){
    return this.state.cancelButtonClicked;  
  },
  
  resetCancelButtonClicked: function(){
    this.setState({ cancelButtonClicked: false });
  },
  
  showInvalidFileTypeMessage: function(file){
    window.alert("Tried to upload invalid filetype " + file.type);
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
