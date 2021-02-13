import React from 'react';
import EntityList from './EntityList/EntityList';

// https://jsonplaceholder.typicode.com/todos

const getTodoList = (successCallback, params = null) => {
	console.log('GETTODOLIST');
	return fetch('https://jsonplaceholder.typicode.com/todos')
	.then(resp => {
		return resp.json()
	})
	.then(resp => {
		return { items: resp }
	})
}

// export const getActList = (successCallback, params = null) => async (dispatch) => {
// 	await sendRequest(
// 		dispatch,
// 		{
// 			method: 'get',
// 			url: 'act',
// 			data: params,
// 			successCallback: successCallback
// 		}
// 	);
// };

function TodoList() {

	const itemsListComponentCallback = React.useCallback((listState, paginationState, setPaginationState, Tools) => {
		console.log('ITEMSLISTCOMPONENTCALLBACK');
		return <div>ItemsListComponent</div>
		// return (
		// 	<ActListTable
		// 		state={listState}
		// 		listState={listState}
		// 		paginationState={paginationState}
		// 		setPaginationState={setPaginationState}
		// 		Tools={Tools}
		// 	/>
		// );
	}, []);

	const listFilterComponentCallback = React.useCallback((filterFSH, getFilterParams, clearFilter, numberOfItems) => {
		console.log('LISTFILTERCOMPONENTCALLBACK');
		return <div>listFilter</div>
		// return (
		// 	<ActListFilter
		// 		handleChangeText={filterFSH.handleChangeText}
		// 		handleChangeSelect={filterFSH.handleChangeArrayToCommaSeparetedString}
		// 		handleChangeCheckbox={filterFSH.handleChangeCheckbox}
		// 		handleChangeMultiselect={filterFSH.handleChangeArrayToCommaSeparetedString}
		// 		formState={filterFSH.formState}
		// 		getFilterParams={getFilterParams}
		// 		numberOfItems={numberOfItems}
		// 	/>
		// );
	}, []);

	const defaultFilterState = {
		title: '',
		userId: 1,
		completed: null,
	};

	return (
		<>
			<EntityList
				itemsListComponentCallback={itemsListComponentCallback}
				listFilterComponentCallback={listFilterComponentCallback}
				pageTitle='TODOs'
				loadItemsListCallback={getTodoList}
				defaultFilterState={defaultFilterState}
				fixedQueryParams={{}}
			/>
		</>
	);
}

export default TodoList;