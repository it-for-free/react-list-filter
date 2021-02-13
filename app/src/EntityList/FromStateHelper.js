import React from 'react';
import dot from 'dot-object';
import produce from "immer";

/**
 *
 * @param initialState
 * @param {object} settings  пример:
 *     {defaultStates: // отвечает за добавление значений в массив
 *          {phoneNumber: {....}, contact: {...}}
 *     }
 */


function FromStateHelper(initialState, settings) {
    const { current: it } = React.useRef({});

    const reducer = React.useMemo(() => {
        const innerProduce = produce((formState, action) => {
            const { type, evt } = action;

            switch (type) {
                case 'handleChangeText':
                    console.log('handleChangeText', evt.target.name, evt.target.value);
                    dot.str(evt.target.name, evt.target.value, formState);
                    break;

                case 'handleChange': // заменит любое значение, даже если это ссылочная непустая структура
                    console.log('handleChange', evt.target.name, evt.target.value);
                    dot.set(evt.target.name, evt.target.value, formState);
                    break;

                case 'handleChangeTextSetNullIfStrEmpty': {
                    let value = evt.target.value;
                    if (value === '') {
                        value = null;
                    }
                    dot.str(evt.target.name, value, formState);
                    break;
                }

                case 'handleChangeInt':
                    // console.log('evt.target.value', evt.target.value);
                    dot.str(evt.target.name, parseInt(evt.target.value), formState);
                    break;

                case 'handleChangeIntSetNullIfZero': {
                    let value = parseInt(evt.target.value);
                    if (value === 0) {
                        value = null;
                    }
                    dot.str(evt.target.name, value, formState);
                    break;
                }

                case 'handleChangeIntSetEmptyStrIfNaN': {
                    let value = parseInt(evt.target.value);
                    if (isNaN(value)) {
                        value = '';
                    }
                    console.log(`handleChangeIntSetEmptyStrIfNaN: ${evt.target.value}`)
                    dot.str(evt.target.name, value, formState);
                    break;
                }
                case 'handleChangeBool':
                    console.log('handleChangeBool', evt.target.name, evt.target.value);
                    dot.str(evt.target.name, (evt.target.value === true || evt.target.value === 'true'), formState);
                    break;

                case 'handlePushDefaultElementInArray': {
                    if (typeof evt.preventDefault === "function") {
                        evt.preventDefault();
                    }

                    let arr = dot.pick(evt.target.name, formState);

                    if (evt.target.value !== undefined) arr.push(evt.target.value);
                    else arr.push({ ...settings.defaultStates[evt.target.dataset['stateName']] });

                    break;
                }
                case 'handleRemoveElementFromArray': {
                    if (typeof evt.preventDefault === "function") {
                        evt.preventDefault();
                    }
                    console.log('handleRemoveElementFromArray', evt.target.name, evt.target.dataset, evt.target.dataset['arrayIndex']);
                    let arr = dot.pick(evt.target.name, formState);
                    arr.splice(evt.target.dataset['arrayIndex'], 1);
                    break;
                }
                case 'handlePushElementInArray': {
                    if (typeof evt.preventDefault === "function") {
                        evt.preventDefault();
                    }
                    let arr = dot.pick(evt.target.name, formState);
                    console.log('evt.target.value', evt.target.value);
                    arr.push(evt.target.value);
                    break;
                }
                case 'handleChangeCheckbox': {
                    console.log('handleChangeCheckbox: ', evt.target.name, ", isChecked: ", evt.target.checked);
                    dot.str(evt.target.name, evt.target.checked, formState);
                    break;
                }
                case 'handleChangeArrayToCommaSeparetedString': {

                    console.log('current array', evt.target.value);
                    let strValue = null;

                    if (Array.isArray(evt.target.value)) {
                        // console.log('current array ', evt.target.value);
                        strValue = evt.target.value.join();
                    }
                    dot.str(evt.target.name, strValue, formState);
                    break;
                }
                case 'setState':
                    return action.state;
            }
        });
        return function innerREducer(...args) {
            return innerProduce(...args);
        }
    }, [settings]);

    const [formState, dispatch] = React.useReducer(reducer, initialState);
    // console.log(formState)

    const handleChangeBool = React.useCallback((evt) => {
        dispatch({ type: 'handleChangeBool', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleChangeText = React.useCallback((evt) => {
        //window.testValue = 'test value';
        // console.log('evt', evt);
        dispatch({ type: 'handleChangeText', evt: evt.nativeEvent });
        window.testValue = null;
    }, [dispatch]);

    const  handleChange = React.useCallback((evt) => {
        dispatch({ type: 'handleChange', evt: evt.nativeEvent });
        window.testValue = null;
    }, [dispatch]);

    const handleChangeTextSetNullIfStrEmpty = React.useCallback((evt) => {
        dispatch({ type: 'handleChangeTextSetNullIfStrEmpty', evt: evt.nativeEvent });
        window.testValue = null;
    }, [dispatch]);

    const handleChangeInt = React.useCallback((evt) => {
        dispatch({ type: 'handleChangeInt', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleChangeIntSetEmptyStrIfNaN = React.useCallback((evt) => {
        dispatch({ type: 'handleChangeIntSetEmptyStrIfNaN', evt: evt.nativeEvent });
    }, [dispatch]);

    const handlePushDefaultElementInArray = React.useCallback((evt) => {
        dispatch({ type: 'handlePushDefaultElementInArray', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleRemoveElementFromArray = React.useCallback((evt) => {
        dispatch({ type: 'handleRemoveElementFromArray', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleChangeIntSetNullIfZero = React.useCallback(evt => {
        dispatch({ type: 'handleChangeIntSetNullIfZero', evt: evt.nativeEvent });
    }, [dispatch]);

    const handlePushElementInArray = React.useCallback(evt => {
        dispatch({ type: 'handlePushElementInArray', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleChangeCheckbox = React.useCallback((evt) => {
        dispatch({ type: 'handleChangeCheckbox', evt: evt.nativeEvent });
    }, [dispatch]);

    const handleChangeArrayToCommaSeparetedString = React.useCallback((evt) => {
        console.dir(`type: handleChangeArrayToCommaSeparetedString, evt: ${JSON.stringify(evt.nativeEvent)}`)
        dispatch({ type: 'handleChangeArrayToCommaSeparetedString', evt: evt.nativeEvent });
    }, [dispatch]);



    const setFormState = React.useCallback(state => {
        dispatch({ type: 'setState', state });
    }, [dispatch]);

    const getFormState = React.useCallback(() => {
        return it.formState;
    }, []);

    Object.assign(it, {
        getFormState,
        formState,
        handleChange,
        setFormState,
        handleChangeBool,
        handleChangeText,
        handleChangeTextSetNullIfStrEmpty,
        handleChangeInt,
        handlePushDefaultElementInArray,
        handleRemoveElementFromArray,
        handleChangeIntSetNullIfZero,
        handleChangeIntSetEmptyStrIfNaN,
        handlePushElementInArray,
        handleChangeCheckbox,
        handleChangeArrayToCommaSeparetedString,
    });

    return it;
}

export default FromStateHelper;