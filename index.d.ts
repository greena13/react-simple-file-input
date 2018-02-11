// Type definitions for React Simple File Input
// Project: react-simple-file-input

/**
 * Called after the user has finished selecting file(s) using the browser dialog.
 */
type onChangeCallback = (file: File|File[]) => void;

/**
 * Called after the onChangeCallback for every file the user has selected. If it
 * returns a truthy value, the read operation for that file is never started - the
 * other files may still be read.
 */
type cancelIfFunction = (file: File|File[]) => boolean;

/**
 * Called when cancelIfFunction() returns a truthy value
 */
type onCancelCallback = (file: File|File[]) => void;

/**
 * Called when a file starts to be loaded
 */
type onLoadStartCallback = (event: ProgressEvent, file: File|File[]) => void;

/**
 * Called every time a file read operation progresses. If it returns a truthy value,
 * the read operation for that file is aborted immediately and the onAbortCallback
 * is called instead of the onProgressCallback.
 */
type abortIfFunction = (event: ProgressEvent, file: File|File[]) => boolean;

/**
 * Called when a file load operation has been aborted because the abortIfFunction
 * has returned a truthy value.
 */
type onAbortCallback = (event: UIEvent, file: File|File[]) => void;

/**
 * Called every time the file read progresses. It is NOT called if the abortIfCallback
 * is defined and returns a truthy value.
 */
type onProgressCallback = (event: ProgressEvent, file: File|File[]) => void;

/**
 * Called when a file has finished successfully being loaded. This callback is NOT
 * called if the load operation is aborted or results in an error.
 */
type onLoadCallback = (event: UIEvent, file: File|File[]) => void;

/**
 * Called when a file read results in an error
 */
type onErrorCallback = (event: UIEvent, file: File|File[]) => void;

/**
 * Called when a file has finished loading, either after onLoadCallback,
 * onErrorCallback or onAbortCallback, depending on the result of the file load
 * operation.
 */
type onLoadEndCallback = (event: ProgressEvent, file: File|File[]) => void;

/**
 * Props object accepted by FileInput
 */
interface ComponentProps {
    /**
     * id attribute to pass to input field
     */
    id?: string,

    /**
     * class attribute to pass to input field
     */
    className?: string,

    /**
     * Whether to allow the user to select more than one file at a time from the
     * browser dialog that appears.
     */
    multiple?: boolean,

    /**
     * When 'buffer', files are read as array buffers; when 'binary', as binary strings;
     * when 'dataUrl' they are read as data urls and when 'text' they are read as text.
     * If not provided, the files selected by the user are not read at all, and only
     * the onChange handler is called.
     */
    readAs?: 'buffer'|'binary'|'dataUrl'|'text',

    /**
     * Callback that handles when the files have been selected
     */
    onChange?: onChangeCallback,

    /**
     * Function to handle whether each file should be read, based on its File object
     */
    cancelIf?: cancelIfFunction,

    /**
     * Callback to handle if a file read is cancelled
     */
    onCancel?: onCancelCallback,

    /**
     * Callback to handle when a file has started being loaded
     */
    onLoadStart?: onLoadStartCallback,

    /**
     * Function to handle whether each file should abort loading the file
     */
    abortIf?: abortIfFunction,

    /**
     * Callback to handle when loading a file is aborted
     */
    onAbort?: onAbortCallback,

    /**
     * Callback to handle when loading a file has progressed (and not been aborted)
     */
    onProgress?: onProgressCallback,

    /**
     * Callback to handle when a file has been successfully loaded
     */
    onLoad?: onLoadCallback,

    /**
     * Callback to handle when loading a file results in an error
     */
    onError?: onErrorCallback,

    /**
     * Callback to handle when a file load operation has completed - whether it was
     * successful, aborted or resulted in an error
     */
    onLoadEnd?: onLoadEndCallback,
}

/**
 * Class that provides a wrapper around a basic input field that provides an API that is
 * consistent with React and JSX conventions.
 *
 * It supports all of the properties available to a file input field, and all of the
 * events supplied by a FileReader with a few additional ones as well.
 */
export default class FileInput {
    /**
     * Creates a new instance of FileInput React component
     */
    constructor(props: ComponentProps, context?: object);
}


