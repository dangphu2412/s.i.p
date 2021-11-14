import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router-dom';
import { ClientNavbar } from '../../components/navbar/ClientNavbar.component';

export function CLientLayout(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<ClientNavbar title="Client"/>
	);
}