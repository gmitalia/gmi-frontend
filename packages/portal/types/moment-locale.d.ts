declare module 'moment/locale/*' {
  import moment from 'moment';
  export default moment;
}

declare module 'refractor/lang/*' {
  const content: any;
  export default content;
}
