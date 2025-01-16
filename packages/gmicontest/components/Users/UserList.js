import React, { useState, useEffect } from 'react'
import GMIApi from '../../src/api/GMIApi'
import Link from 'next/link';
import { AreaTitle } from '../library/Titles/AreaTitle';

export default function UserList(props)
{
	/**@type {[ContestsResponse, (data: ContestsResponse)=> any]} */
	let [data, setData] = useState()

	useEffect(()=>
	{
		GMIApi.getInstance().getContests((data) =>
		{
			setData(data)
		})
	}, [])

	if(!data)
		return (<div>Loading...</div>)

	if(!data.success)
		return (<div>{data.error}</div>)

	return (
		<Link  href={`/users`}>
			<div className='cursor-pointer '>
			<AreaTitle title="Utenti" inverted={true} />
			</div>
		</Link>
	)
}
