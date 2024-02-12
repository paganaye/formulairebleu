// import { Component, JSX } from 'solid-js';
// import { navigateToPage } from '../App';

// interface LinkProps {
//   page: string;
//   children: JSX.Element;
// }

// const Link: Component<LinkProps> = (props) => {
//   const handleClick = (event: MouseEvent) => {
//     event.preventDefault();
//     const url = new URL(window.location.href);
//     url.searchParams.set('page', props.page);
//     window.history.pushState({}, '', url.toString());
//     navigateToPage(props.page)
//     // Vous pouvez également ajouter ici la logique pour mettre à jour le composant actuel, si nécessaire
//   };
//   return (
//     <a href={`?page=${props.page}`} onClick={handleClick}>
//       {props.children}
//     </a>
//   );
// };

// export default Link;