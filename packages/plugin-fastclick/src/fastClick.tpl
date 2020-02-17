// Initialize fastclick
document.addEventListener(
  'DOMContentLoaded',
  () => {
    FastClick.attach(document.body, {{{ Options }}});
  },
  false,
);
