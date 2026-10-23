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

  let statusColor = "bg-accent"
  if(Date.now() > complete_date)
    statusColor = "bg-success"
  else if(Date.now() > end_date)
    statusColor = "bg-warning"

  const selectedClass = `${isSelected ? "bg-secondary text-content border-secondary" : "ds-surface ds-text-content"}`;
  const hoverClass = "hover:cursor-pointer hover:border-secondary"

  return (
    <Link href={`/competizioni/contest?contest=${contest.id}`}>

      <div className={`flex flex-row items-center ds-rounded-cta border border-default p-3 ${selectedClass} ${hoverClass}`}>
        
        <div className='mr-2 flex w-5 justify-center'>
          <span className={`inline-block w-2 h-2 rounded-full ${statusColor}`} aria-hidden="true" />
        </div>
        <div className="text-sm font-semibold">
          {contest.name}
        </div>

      </div></Link>

  )
}
