import React from 'react';
import { useDispatch } from 'react-redux';
import { RouteProps } from 'react-router-dom';

export function AdminLayout(props: RouteProps) {
	const dispatch = useDispatch();
	return (
		<div>
            Hello world
		</div>
	);
}