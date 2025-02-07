import { JsxComponent } from "../../core/tiny-jsx";
import { Box } from "../../core/Box";
import { ConstView } from './BootstrapConstView';

export type VoidVueProps = {
  box: Box;
};


export const VoidView: JsxComponent<VoidVueProps> = (props) => {
  // switch (props.view) {
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

  //props.box.type.view.content
  //{type: 'const', data: '', view: 'html'}
  return <ConstView {...props.box.type.view as any} />
};
