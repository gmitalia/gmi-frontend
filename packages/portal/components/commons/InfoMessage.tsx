const InfoMessage = (props) =>
{
  return (
    <div
     className="bg-surface border border-default py-4 px-6 text-sm text-content mb-6"
     role="alert"
    >
      <div>{props.children}</div>
    </div>
  );
};

export default InfoMessage;
