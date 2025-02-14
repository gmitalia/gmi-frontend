import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const ContestElement = (props)=>
{
	const contest = props.contest
	const end_date = Date.parse(contest.end_at)
	const complete_date = Date.parse(contest.completed_at)
	const router = useRouter()
	const { query } = router;

	const isSelected = contest.id == query.contest;

	let icon = "fa-clock"
	if(Date.now() > complete_date)
		icon = "fa-trophy"
	else if(Date.now() > end_date)
		icon = "fa-address-book"

	const selectedClass = `${isSelected ? "bg-secondary text-white border-secondary" : "border-white"}`;
	const hoverClass = "hover:cursor-pointer hover:border-secondary"

	return (
		<a href={`/contest?contest=${contest.id}`}>

			<div className={`flex flex-row items-center border p-2 ${selectedClass} ${hoverClass}`}>
				
				<div className='mr-2'>
					<i className={`fa ${icon}`} aria-hidden="true" />
				</div>
				
				{contest.name}

			</div>
		</a>

	)
}