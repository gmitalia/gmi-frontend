export const ButtonHeader = (props) => {
    const { icon, title, onClick } = props;


    const onClickHandler = () => {
        if (onClick) {
            onClick()
        }
    }

    return <button className="m-2" onClick={onClickHandler}>
        {icon ? <i className={icon}></i> : undefined}
        {title ? <span>{title}</span> : undefined}
    </button>
}