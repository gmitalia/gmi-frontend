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

  const selectedClass = `${isSelected ? "bg-secondary text-content border-secondary shadow" : "ds-surface ds-text-content"}`;
  const hoverClass = "hover:cursor-pointer hover:border-secondary hover:-translate-y-0.5 hover:shadow-glow transition-all"

  return (
    <Link href={`/contest?contest=${contest.id}`}>

      <a><div className={`flex flex-row items-center ds-rounded-cta border border-default p-3 ${selectedClass} ${hoverClass}`}>
        
        <div className='mr-2 w-5 text-center'>
          <i className={`fa ${icon}`} aria-hidden="true" />
        </div>
        <div className="text-sm font-semibold">
          {contest.name}
        </div>

      </div></a>
    </Link>

  )
}
