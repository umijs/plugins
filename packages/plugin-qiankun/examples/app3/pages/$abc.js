export default function (props) {
  const { abc } = props.match.params;
  return (
    <div>
      <h1>{abc}</h1>
    </div>
  );
}
