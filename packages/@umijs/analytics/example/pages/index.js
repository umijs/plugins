import styles from './index.css';

export default function() {
  const onClick = ()=>{
    console.log('click text')
    // _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    window._hmt.push(['_trackEvent', 'test', 'click', 'plugindemo', 'true']);
  }
  return (
    <div className={styles.normal}>
      <h1 onClick={onClick}>Page index</h1>
    </div>
  );
}
