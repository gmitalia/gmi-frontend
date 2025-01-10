import React from "react"

export default function IconBtn(props)
{
	const disabledButton = props.disabled || false;

	return (
		<a href={props?.url} title={props?.title} className={props.className}>
			<button
			 disabled={disabledButton}
			 onClick={props?.onClick}
			 className="inline-block p-2 bg-primary text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-secondary hover:shadow-lg focus:bg-secondary focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-700 disabled:opacity-20"
			>
				{props.children}
			</button>
		</a>
	)
}
