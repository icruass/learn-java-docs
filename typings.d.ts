import 'umi/typings';

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism';
