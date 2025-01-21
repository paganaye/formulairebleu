import { Component } from 'solid-js';
import { Box } from '../core/Box';

export type ConstVueProps = {
  label?: string | undefined;
  box: Box;
};


export const ConstVue: Component<ConstVueProps> = (props) => {
  // switch (props.viewAs) {
  //   case "html":
  //     return <div innerHTML={props.data} />;
  //   case "text":
  //     return <div innerText={props.data} />;
  //   case "file":
  //     return <p>Todo</p>;
  //   case "image":
  //     return <>
  //       <img src={props.data} />
  //     </>;
  //   case "object":
  //     return <p>Todo</p>;
  // }
  return <>TODO</>
};
