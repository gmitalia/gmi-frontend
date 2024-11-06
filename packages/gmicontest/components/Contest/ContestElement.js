import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const ContestElement = (props) => {
    const contest = props.contest
    const end_date = Date.parse(contest.end_at)
    const complete_date = Date.parse(contest.completed_at)
    const router = useRouter()
    const {query} = router;

    const isSelected = contest.id == query.contest;

    let icon = <i className="fa fa-clock" aria-hidden="true"></i>
    if (Date.now() > complete_date)
        icon = <i className="fa fa-trophy" aria-hidden="true"></i>
    else if (Date.now() > end_date)
        icon = <i className="fa fa-address-book" aria-hidden="true"></i>

    const selectedClass = `${isSelected ? "bg-secondary text-white border-secondary" : "border-white"}`;
    const hoverClass = "hover:cursor-pointer hover:border-secondary"
    return (
        <Link href={`/contest?contest=${contest.id}`}>

        <div className={`flex flex-row items-center border p-2 ${selectedClass} ${hoverClass}`}>
            <div className='mr-2'>{icon}</div>
                {contest.name}
        </div>
        </Link>

    )
}