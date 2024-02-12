// import { Component, JSX, createSignal, createEffect, For } from 'solid-js';

// interface PagerProps {
//   pages: number;
//   currentPage: number;
//   setCurrentPage: (page: number) => void;
// }

// const Pager: Component<PagerProps> = (props) => {

//   const [visiblePages, setVisiblePages] = createSignal<(number | "…")[]>([]);

//   createEffect(() => {
//     const pages: (number | "…")[] = [];
//     let lastPage = 0;

//     function addPage(page: number) {
//       if (page >= 1 && page <= props.pages && page > lastPage) {
//         if (page > lastPage + 1) pages.push("…")
//         pages.push(page);
//         lastPage = page;
//       }
//     }
//     // first two pages
//     addPage(1);
//     addPage(2);
//     // three pages around the one I am on
//     addPage(props.currentPage - 1);
//     addPage(props.currentPage);
//     addPage(props.currentPage + 1);
//     // last two pages
//     addPage(props.pages - 1);
//     addPage(props.pages);

    
//     setVisiblePages(pages);
//   });

//   return (
//     <div class="join">
//       <For each={[...visiblePages()]}>
//         {(page) => (
//           <button
//             class={`join-item btn ${props.currentPage === page ? 'btn-active' : ''}`}
//             disabled={typeof page != 'number'}
//             onClick={() => props.setCurrentPage?.(page as number)}>
//             {page}
//           </button>
//         )}
//       </For>
//     </div >
//   );
// };

// export default Pager;
