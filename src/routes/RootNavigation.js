import * as React from 'react';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();
export const routeNameRef = React.createRef();

export function navigate(name, params) {
  // console.log('[RootNavigation] navigationRef', navigationRef);
  // console.log('[RootNavigation] isReadyRef', isReadyRef);
  // console.log('[RootNavigation] navigate', name);

  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
  // navigationRef.current?.navigate(name, params);
}

export function getCurrentRouteName(action) {
  return routeNameRef;
}