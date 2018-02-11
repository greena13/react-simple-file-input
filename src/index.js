import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Map of short-hand aliases accepted by react-simple-file-input to
 * actual javascript methods
 */
const READ_METHOD_ALIASES = {
  buffer: 'readAsArrayBuffer',
  binary: 'readAsBinaryString',
  dataUrl: 'readAsDataURL',
  text: 'readAsText'
};

/**
 * List of props that are accepted by the component and that should be
 * passed to the FileReader instance (after down-casing the name and checking
 * that they are indeed defined)
 */
const SUPPORTED_EVENTS = [
  'onLoadStart',
  'onLoadEnd',
  'onLoad',
  'onAbort',
  'onError'
];

/**
 * A look-up of properties supported by the React component, but should
 * not be passed down to the input component
 */
const UNSUPPORTED_BY_INPUT = {
  readAs: true,
  abortIf: true,
  cancelIf: true,
  onCancel: true
};

/**
 * @class Provides a wrapper around a basic input field that provides an API that is
 * consistent with React and JSX conventions.
 *
 * It supports all of the properties available to a file input field, and all of the
 * events supplied by a FileReader with a few additional ones as well.
 */
class FileInput extends Component {

  /**
   * Creates a new instance of FileInput React component
   * @param {ComponentProps} props React props object - see propTypes below
   * @param {Object} context React context object
   */
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Checks that the necessary APIs are available in the browser environment
   * when the component is mounted and displays a warning if anything is
   * missing.
   */
  componentDidMount(){

    if (window && !window.File || !window.FileReader) {
      console.warn(
        'Browser does not appear to support API react-simple-file-input relies upon'
      );
    }
  }

  /**
   * Function that is called to handle every change event that is triggered by the
   * input component.
   *
   * @param {Event} event file input field event to handle
   */
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
            } else if (onProgress){
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

  /**
   * Renders an input component that receives all of the props passed to this component
   * less those that are not supported by the input component.
   * @returns {Component} input component configured according to the props passed
   *          to this component
   */
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
         onChange={ this.handleChange }
      />
    );
  }
}

/**
 * @callback onChangeCallback called after the user has finished selecting file(s)
 *          using the browser dialog.
 * @param {File|Array.<File>} files Either a single File object representing the
 *        file the user has selected, or if the multiple prop was used then an
 *        array of File objects representing the files the user selected.
 */

/**
 * @callback cancelIfFunction called after the onChangeCallback for every file the
 *          user has selected. If it returns a truthy value, the read operation for
 *          that file is never started - the other files may still be read.
 * @param {File} file a File object representing one of the files the user has
 *        selected.
 * @return {Boolean} Whether to cancel reading the file
 */

/**
 * @callback onCancelCallback called when cancelIfFunction() returns a truthy value
 * @param {File} file File object that caused cancelIfFunction() to return a truthy
 *        value
 */

/**
 * @callback onLoadStartCallback called when a file starts to be loaded
 * @param {ProgressEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @callback abortIfFunction called every time a file read operation progresses.
 *          If it returns a truthy value, the read operation for that file is
 *          aborted immediately and the onAbortCallback is called instead of
 *          the onProgressCallback.
 * @param {ProgressEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file a File object representing one of the files the user has
 *        selected.
 * @return {Boolean} Whether to abort reading the file
 */

/**
 * @callback onAbortCallback called when a file load operation has been aborted
 *        because the abortIfFunction has returned a truthy value.
 * @param {UIEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @callback onProgressCallback called every time the file read progresses. It is
 *        NOT called if the abortIfCallback is defined and returns a truthy value.
 * @param {ProgressEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @callback onLoadCallback called when a file has finished successfully being loaded
 *           This callback is NOT called if the load operation is aborted or results
 *           in an error.
 * @param {UIEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @callback onErrorCallback called when a file read results in an error
 * @param {UIEvent} event The event object representing the progress of reading
 *        the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @callback onLoadEndCallback called when a file has finished loading, either
 *        after onLoadCallback, onErrorCallback or onAbortCallback, depending on
 *        the result of the file load operation.
 * @param {ProgressEvent} event The event object representing the progress of
 *        reading the file
 * @param {File} file The File object containing information about the file
 */

/**
 * @typedef {Object} ComponentProps Props object accepted by FileInput
 */
FileInput.propTypes = {
  /**
   * @property {String} [id] id attribute to pass to input field
   */
  id: PropTypes.string,

  /**
   * @property {String} [className] class attribute to pass to input field
   */
  className: PropTypes.string,

  /**
   * @property {Boolean} [multiple=false] Whether to allow the user to select more than
   *           one file at a time from the browser dialog that appears.
   */
  multiple: PropTypes.bool,

  /**
   * @property {'buffer'|'binary'|'dataUrl'|'text'} [readAs] When 'buffer', files
   *            are read as array buffers; when 'binary', as binary strings; when
   *            'dataUrl' they are read as data urls and when 'text' they are read as
   *            text. If not provided, the files selected by the user are not read
   *            at all, and only the onChange handler is called.
   */
  readAs: PropTypes.oneOf( Object.keys(READ_METHOD_ALIASES) ),

  /**
   * @property {onChangeCallback} [onChange] Callback that handles when the files
   *            have been selected
   */
  onChange: PropTypes.func,

  /**
   * @property {cancelIfFunction} [cancelIf] Function to handle whether each file
   *            should be read, based on its File object
   */
  cancelIf: PropTypes.func,

  /**
   * @property {onCancelCallback} [onCancel] Callback to handle if a file read is
   *           cancelled
   */
  onCancel: PropTypes.func,

  /**
   * @property {onLoadStartCallback} [onLoadStart] Callback to handle when a file
   *           has started being loaded
   */
  onLoadStart: PropTypes.func,

  /**
   * @property {abortIfFunction} [abortIf] Function to handle whether each file
   *            should abort loading the file
   */
  abortIf: PropTypes.func,

  /**
   * @property {onAbortCallback} [onAbort] Callback to handle when loading a file
   *            is aborted
   */
  onAbort: PropTypes.func,

  /**
   * @property {onProgressCallback} [onProgress] Callback to handle when loading a
   *            file has progressed (and not been aborted)
   */
  onProgress: PropTypes.func,

  /**
   * @property {onLoadCallback} [onLoad] Callback to handle when a file has been
   *            successfully loaded
   */
  onLoad: PropTypes.func,

  /**
   * @property {onErrorCallback} [onError] Callback to handle when loading a file
   *            results in an error
   */
  onError: PropTypes.func,

  /**
   * @property {onLoadEndCallback} [onLoadEnd] Callback to handle when a file load
   *            operation has completed - whether it was successful, aborted or
   *            resulted in an error
   */
  onLoadEnd: PropTypes.func,
};

export default FileInput;
