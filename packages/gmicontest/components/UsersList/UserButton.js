import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { AreaTitle } from '../library/Titles/AreaTitle';

export default function UserButton(props)
{

	return (
		<Link  href={`/users`}>
			<div className='cursor-pointer '>
			<AreaTitle title="Utenti" inverted={true} />
			</div>
		</Link>
	)
}
