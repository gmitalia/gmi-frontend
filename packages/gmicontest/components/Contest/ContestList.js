import React, { useState, useEffect } from 'react'
import GMIApi from '../../src/api/GMIApi'
import { AreaTitle } from '../library/Titles/AreaTitle';
import { ContestElement } from './ContestElement';

export default function ContestList(props)
{
	/**@type {[ContestsResponse, (data: ContestsResponse)=> any]} */
	let [data, setData] = useState()

	useEffect(()=>
	{
		GMIApi.getInstance().getContests(setData)
	}, [])

	if(!data)
		return (<div>Loading...</div>)

	if(!data.success)
		return (<div>{data.error}</div>)

	return (
		<div className='h-full flex flex-col'>
			<AreaTitle title="Competizioni" />

			<div className="h-full overflow-y-scroll flex-grow-v">
			{data.contests.map((contest)=>
			(
				<ContestElement key={contest.id} contest={contest} />
			))}
			</div>
		</div>
	)
}
