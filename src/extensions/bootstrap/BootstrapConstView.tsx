import { Component, formulaireBleuJSXFactory, formulaireBleuJSXFragmentFactory } from "../../core/jsx";
import { ConstValue } from "../../core/IQuery";

export type ConstVueProps = Omit<ConstValue, 'type'> & {

};

export const ConstView: Component<ConstVueProps> = (props) => {

  switch (props.view) {
    case "html":
      return <div innerHTML={props.data} />;
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
