import { useState } from 'react';

export default () => {
  const [ role, setRole ] = useState('admin');
  const switchRole = () => setRole(r => r === 'admin' ? 'user' : 'admin')
  return { role, switchRole };
}
