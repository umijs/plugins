export default (props) => {
  const { id } = props.params || {};
  return (
    <div>Hello {id || ''}</div>
  )
}
