export const ExtLink = (props) => {
    const { href, children } = props;
    return <a className="font-semibold hover:cursor-pointer" href={href} target="_black">{children}</a>
}
