import { JsxComponent, formulaireBleuJSX, formulaireBleuJSXFragment } from "../../core/tiny-jsx";
import { ConstValue } from "../../core/IQuery";

export type ConstVueProps = Omit<ConstValue, 'type'> & {

};

export function ConstView(props: ConstVueProps) {

  switch (props.view) {
    case "html":
      return <div innerHTML={props.value} />;
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
  }
  return <>TODO</>
};
