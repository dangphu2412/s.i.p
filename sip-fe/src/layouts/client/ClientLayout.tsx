import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router-dom';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';
import { fireError } from '../../modules/error/error.action';

export function CLientLayout(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<>
			<ClientNavbar title="Client"/>
			<button onClick={() => {dispatch(fireError({message: 'Hello con di'}));}}>Click</button>
		</>
	);
}