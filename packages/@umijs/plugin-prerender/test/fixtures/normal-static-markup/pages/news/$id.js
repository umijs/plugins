export default (props) => {
  const { id } = props.route.params;
  return (
    <div>Hello {id}</div>
  )
}
