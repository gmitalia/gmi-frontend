export const PageTitle = (props) => {
    const { title } = props;
    return <h1 className="text-primary text-4xl font-bold mb-4">
        {title}
    </h1>
}