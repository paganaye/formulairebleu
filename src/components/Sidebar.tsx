// import { Component, createMemo } from 'solid-js';
// import { IRouteInfo, getCurrentRouteInfo, navigateToPage } from '../App';
// import { T } from '../core/Translation';

// interface ISidebarProps {
//   routeInfos: IRouteInfo[]
// }

// const Appbar: Component<ISidebarProps> = (props) => {
//   const handleClick = (routeInfo: IRouteInfo, e: MouseEvent) => {
//     e.preventDefault();
//     document.getElementById('main-drawer').click()
//     navigateToPage(routeInfo.id)
//   };

//   const currentRouteInfo = createMemo(() => {
//     return getCurrentRouteInfo()
//   })

//   return (
//     <div class="p-4 menu min-h-full w-70 bg-base-200 text-base-content">
//       <div class="text-xl font-bold">AFS Mailing</div>
//       <ul>
//         <li>

//         </li>
//         {/* Sidebar content here */}
//         {props.routeInfos.map((routeInfo) => (
//           <li><a href={"/#" + T(routeInfo.text)} onClick={(e) => handleClick(routeInfo, e)}
//             classList={{ "active": routeInfo == currentRouteInfo() }}
//           >{T(routeInfo.text)}</a></li>
//           // <MenuItem onClick={() => handleMenuClicked(routeInfo)} selected={appCurrentPage() == routeInfo.id}>
//           //     <Typography textAlign="center">{T(routeInfo.text)}</Typography>
//           //   </MenuItem>
//         ))}
//       </ul >
//     </div>
//   );
// };

// export default Appbar;