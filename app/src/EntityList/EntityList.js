import React from 'react';
import PropTypes from 'prop-types';
import jswl from 'js-wrapper-lib';
import { setPageTitle } from './pageTitle';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';
import usePaginationState from './usePaginationState';
import FromStateHelper from './FromStateHelper';
import MainProgress from './MainProgress';
import CenteredNote from './CenteredNote';
import queryString from 'query-string';


function EntityList(props) {
    const dispatch = useDispatch();

    let getParams = !jswl.isEmpty(props.location) ?
        queryString.parse(props.location.search)
        : {};

    // console.log('getParams', getParams);

    const { itemsListComponentCallback,
        listFilterComponentCallback,
        pageTitle, loadItemsListCallback, defaultFilterState, fixedQueryParams, externalOptions, emptyFilterState } = props;

    const defaultFilterStateObject = !jswl.isEmpty(defaultFilterState) ?
        { ...defaultFilterState, ...getParams } : {};

    const fixedQueryParamsObject = React.useMemo(() => {
        return !jswl.isEmpty(fixedQueryParams) ? fixedQueryParams : {};
    }, [fixedQueryParams]
    );

    React.useEffect(
        () => {
            if (!jswl.isEmpty(pageTitle)) {
                setPageTitle(pageTitle);
            }
        },
        []
    );

    const listFSH = FromStateHelper({
        items: [],
        fullResponse: null,
        downloadingComplete: false,
        downloadInProcess: false,
    }, {});

    const { formState: listState,
        setFormState: setListState,
        getFormState: getListState, } = listFSH;


    const filterFSH = FromStateHelper(
        defaultFilterStateObject,
        {}
    );

    const { formState: filterState,
        setFormState: setFilterState,
        getFormState: getFilterState, } = filterFSH;


    const [paginationState, setPaginationState,
        updatePaginationStateFromResponse] = usePaginationState();

    const getListQueryParams = React.useCallback(() => {

        return {
            limit: paginationState.itemsPerPage,
            page: paginationState.currentPageNumber + 1,
            ...fixedQueryParamsObject,
            ...getFilterState(),
        }

    }, [getListState, paginationState.itemsPerPage,
        paginationState.currentPageNumber, fixedQueryParamsObject]);

    const clearFilter = React.useCallback(() => {
        filterFSH.setFormState(emptyFilterState);
    }, [filterFSH.setFormState])

    const listFilterComponent = React.useMemo(
        () => {
            return listFilterComponentCallback(filterFSH, getListQueryParams, clearFilter, listState.items.length)
        },
        [filterFSH.formState, getListQueryParams]
    );

    const handleListGettingRequest = React.useCallback((requestData, params) => {

        if (!jswl.isDefined(params)) {
            throw new Error('Your should pass defined value of params array from callback!');
        }

        //  console.log('>>>>in callback state', getListQueryParams());

        if (JSON.stringify(getListQueryParams()) === JSON.stringify(params)) {
            // console.log('++++states are SAME!');
            setListState({
                ...getListState(),
                items: requestData.items,
                fullResponse: requestData,
                downloadingComplete: true,
                downloadInProcess: false,
            });

            updatePaginationStateFromResponse(requestData);
        } else { // если ответ пришел на более старый запрос
            // console.log('++++states are DEFFERENT!', getListQueryParams(), params);
            setListState({
                ...getListState(),
                downloadingComplete: true,
                downloadInProcess: false,
            });
            loadList();
        }

    }, [getListState, setListState, updatePaginationStateFromResponse, getListQueryParams]);

    const loadList = React.useCallback(() => {

        console.log('loadList!');
        setListState({
            ...getListState(),
            downloadInProcess: true,
        });

        // dispatch(loadItemsListCallback(
        //     handleListGettingRequest,
        //     getListQueryParams()
        // ));

        loadItemsListCallback(
            handleListGettingRequest,
            getListQueryParams()
        );

    },
        [getListState, handleListGettingRequest, getListQueryParams]
    );

    /**
     * @var Object набор дополнительных вывозов/сущностей, которые могут пригодиться к колбеке списка,
     * например обратный вызов для перезагрузки списка
     */
    const Tools = React.useMemo(() => {
        return {
            reloadListCallback: loadList
        };
    }, [loadList]);


    const itemsListComponent = React.useMemo(() => {
        return itemsListComponentCallback(listState, paginationState, setPaginationState, Tools, externalOptions)
    }, [listState.items, paginationState, setPaginationState, Tools, externalOptions]
    );

    React.useEffect( // последующие загрузки
        () => {
            // console.log('load list params', [...Object.values(getListQueryParams())]);

            if (!getListState().downloadInProcess) {
                loadList();
            } else {
                console.log('stop request!');
                console.count('stop request!');
            }
        },
        [getListState, ...Object.values(getListQueryParams())] // paginationState.currentPageNumber
    );

    console.log('getListQueryParams()', getListQueryParams());
    console.log('listState', listState);
    return (
        <>
            {listFilterComponent}
            <Box className={'wrapper'}>
                {
                    listState.downloadingComplete ?
                        !jswl.isEmpty(listState.items) ?
                            itemsListComponent
                            : <CenteredNote text="Список пуст." />
                        :
                        <MainProgress text="Загрузка данных....." />
                }
            </Box>

        </>
    );
}

EntityList.propTypes = {
    itemsListComponentCallback: PropTypes.func.isRequired,
    listFilterComponentCallback: PropTypes.func.isRequired,
    pageTitle: PropTypes.string,
    loadItemsListCallback: PropTypes.func.isRequired,
    defaultFilterState: PropTypes.object,
    fixedQueryParams: PropTypes.object,
    externalOptions: PropTypes.object, // дополнительный объект для изменения состояния списка извне
    emptyFilterState: PropTypes.object,
    location: PropTypes.object, //  как или аналогичный props.location из React Router
};

const NoChachedEntityList = EntityList;

export default React.memo(EntityList);
export { NoChachedEntityList };