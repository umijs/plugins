import { useRootExports, Link } from 'umi';

export default function(props) {
  const rootExports = useRootExports();
  const { abc } = props.match.params;
  return (
    <div>
      <h1>{abc}</h1>
    </div>
  );
}
