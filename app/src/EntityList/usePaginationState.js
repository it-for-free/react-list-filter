import React from 'react';


function usePaginationState() {

    const [state, setState] = React.useState({
        itemsPerPage: 50,
        currentPageNumber: 0,
        totalItemsCount: 0,
        pageCount: 0,
    });


    const updateStateFromResponse = React.useCallback((responseData) => {
        setState(
            {
                ...state,
                itemsPerPage: responseData.paginationData.numItemsPerPage,
                currentPageNumber: responseData.paginationData.current ? responseData.paginationData.current - 1 : 0,
                totalItemsCount: responseData.paginationData.totalCount,
                pageCount: responseData.paginationData.pageCount,
            }
        );
    },
        [state, setState]
    );

    const Pagination = React.useMemo(() => {
        return [
            state,
            setState,
            updateStateFromResponse
        ];
    },
        [
            state,
            setState,
            updateStateFromResponse
        ]
    );

    return Pagination;
}


export default usePaginationState;