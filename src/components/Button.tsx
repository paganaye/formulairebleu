// import { Component, JSX } from 'solid-js';
// import { navigateToPage } from '../App';
// import { twMerge } from 'tailwind-merge';

// interface IButtonProps {
//   class?: string;
//   startIcon?: any;
//   onClick?: (event: MouseEvent) => void;
//   disabled?: boolean;
//   children: JSX.Element;
// }

// const Button: Component<IButtonProps> = (props) => {
//   function handleClick(event: MouseEvent) {
//     event.preventDefault();
//     props.onClick(event)
//   };
//   return (
//     <button class={twMerge("btn", props.class)} disabled={props.disabled} onClick={handleClick}>{props.children}</button>
//   );
// };

// export default Button;