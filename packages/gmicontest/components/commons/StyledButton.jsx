import React from "react"

export default function StyledButton(props) {
    const disabledButton = props.disabled || false;
    return (
      <button disabled={disabledButton} className={`${props.className} inline-block px-6 py-2.5 bg-primary text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-secondary hover:shadow-lg focus:bg-secondary focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-700 disabled:opacity-20`} onClick={props?.onClick}>{props.children}</button>
    )
}
