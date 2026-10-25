import React, { useState, useEffect } from 'react'
import GMIApi from '../../src/api/GMIApi'
import { AreaTitle } from '../commons/AreaTitle';
import { ContestElement } from './ContestElement';

export default function ContestList(props)
{
  /**@type {[ContestsResponse, (data: ContestsResponse)=> any]} */
  let [data, setData] = useState<any>()

  useEffect(()=>
  {
    GMIApi.getInstance().getContests(setData)
  }, [])

  const renderList = function()
  {
    if(!data)
      return (<div className="text-sm text-content-muted">Loading...</div>)
  
    if(!data.success)
      return (<div className="text-sm text-error">{data.error}</div>)

    return data.contests.map((contest)=>
    (
      <ContestElement key={contest.id} contest={contest} />
    ))
  }


  return (
    <div className='flex flex-col'>
      <AreaTitle title="Competizioni" />
      <div className="flex flex-col gap-2">
      {renderList()}
      </div>
    </div>
  )
}
