# react-simple-file-input

[![npm](https://img.shields.io/npm/dm/react-simple-file-input.svg)]()
[![GitHub license](https://img.shields.io/github/license/greena13/react-simple-file-input.svg)](https://github.com/greena13/react-simple-file-input/blob/master/LICENSE)

Simple wrapper for the HTML input tag and HTML5 FileReader API that supports multiple files

## Usage

```javascript
var FileInput = require('react-simple-file-input');

<FileInput
  readAs='binary'
  multiple

  onLoadStart={ this.showProgressBar }
  onLoad={ this.handleFileSelected }
  onProgress={ this.updateProgressBar }

  cancelIf={ checkIfFileIsIncorrectFiletype }
  abortIf={ this.cancelButtonClicked }

  onCancel={ this.showInvalidFileTypeMessage }
  onAbort={ this.resetCancelButtonClicked }
 />
```

## Installation

### React >=0.14.9

```bash
npm install react-simple-file-input --save
```

### React <0.14.9

```bash
npm install react-simple-file-input@1.0.0 --save
```

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

Each event handler receives the native event as the first argument and the selected `File` object as the second.

#### Custom events

- onChange
- onCancel

The `onChange` handler is called whenever the file is changed and occurs before the file is read from disk. It receives a `File` object as its only argument when the `multiple` prop is false (or left undefined), otherwise it receives an array-like list of `File` objects as its only argument.

The `onCancel` handler receives the `File` object corresponding to the file the user attempted to read from the file system.

### Allowing multiple files to be selected

By setting the `multiple` prop to a truthy value, you allow the user to select multiple files at once, using the same input by either ctrl + click or shift + clicking more than one file in file selection modal that appears.

This causes the `onChange` handler to receive a list of `File` objects (even if it's a only one file) rather a single `File` object. All other handlers are triggered independently, for each file the user has selected, so cancelling, aborting and monitoring the progress of reading each file may be done separately.

If you wish to cancel or abort all file reads if one fails, this must be done by maintaining state externally, in your handlers.

### Skipping file reads

If the `readAs` option is not specified, the file will not be read from disk and only `onChange` will be triggered. All other events as skipped.

### Aborting and cancelling file reads

There are two props for canceling and aborting file reads:

#### Cancelling the file read before it begins

The `cancelIf` prop accepts a function that receives the `File` object. If the function is defined and returns a truthy value then the file upload will be cancelled before it begins reading from the filesystem and the `onCancel` handler is called with the `File` object.

### Aborting the file read once it has begun

If defined, the `abortIf` function is executed just before every time the `onProgress` handler is called. It is passed the native event and the `File` object the first and second arguments; if it returns a truthy value, the file read is aborted and the `onAbort` handler is called. The `onProgress` event is *not* called if the file read aborts.

### Children

Children are not supported. If you wish to use another element to set the clickable area for the user, use labels or a similar strategy (see example below).

### Styling, hiding or replacing the default input field

All props passed to `FileInput` are passed to the resulting `<input>` tag so it's possible to style or hide the default input field by passing `style` or `className` prop values.

To replace the input field with another element, hide it and use a parent label as demonstrated in the example below:

## Examples

```javascript
import React, { Component } from 'react';
var FileInput = require('react-simple-file-input');

var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];

function fileIsIncorrectFiletype(file){
  if (allowedFileTypes.indexOf(file.type) === -1) {
    return true;
  } else {
    return false;
  }
}

class AssetsForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.cancelButtonClicked = this.cancelButtonClicked.bind(this);
    this.resetCancelButtonClicked = this.resetCancelButtonClicked.bind(this);
    this.showProgressBar = this.showProgressBar.bind(this);
    this.updateProgressBar = this.updateProgressBar.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);

    this.state = {
      cancelButtonClicked: false
    };
  }

  render(){
    return(
      <div>
        To upload a file:

         <label >
            <FileInput
              readAs='binary'
              style={ { display: 'none' } }

              onLoadStart={this.showProgressBar}
              onLoad={this.handleFileSelected}
              onProgress={this.updateProgressBar}

              cancelIf={fileIsIncorrectFiletype}
              abortIf={this.cancelButtonClicked}

              onCancel={this.showInvalidFileTypeMessage}
              onAbort={this.resetCancelButtonClicked}
             />

           <span >
            Click Here
           </span>

         </label>
      </div>
    );
  }

  cancelButtonClicked(){
    return this.state.cancelButtonClicked;
  }

  resetCancelButtonClicked(){
    this.setState({ cancelButtonClicked: false });
  }

  showInvalidFileTypeMessage(file){
    window.alert("Tried to upload invalid filetype " + file.type);
  }

  showProgressBar(){
    this.setState({ progressBarVisible: true});
  }

  updateProgressBar(event){
    this.setState({
      progressPercent: (event.loaded / event.total) * 100
    });
  }

  handleFileSelected(event, file){
    this.setState({file: file, fileContents: event.target.result});
  }
}
```

## Upgrading from 0.x.x

To upgrade from 0.x.x to 1.0.0, you simply need to move any children of `FileInput` into an enclosing `label` tag, as shown in the example above and pass some styling using the `style` or `className` props to hide the default input field.

## Contributors

Thank you to github users selbekk and Zhouzi for your valued contributions via pull requests. They ended up informing most of the improvements in version 1.0.0.
