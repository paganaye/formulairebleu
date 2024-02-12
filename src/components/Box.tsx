// import { Component, JSX, children } from 'solid-js';

// interface IBoxProps {
//   children?: JSX.Element;
// }

// const Box: Component<IBoxProps> = (props) => {
//   const handleClick = (event: MouseEvent) => {
//     event.preventDefault();
//     const url = new URL(window.location.href);
//     window.history.pushState({}, '', url.toString());
//     // Vous pouvez également ajouter ici la logique pour mettre à jour le composant actuel, si nécessaire
//   };
//   return (
//     <div>
//       {props.children}
//     </div>
//   );
// };

// export default Box;