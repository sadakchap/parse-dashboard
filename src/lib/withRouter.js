import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, useLocation, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { getPageViewName, amplitudeLogEvent } from 'lib/amplitudeEvents'

export function withRouter(Component) {
  function render(props) {
    const params = useParams();
    const navigate = useNavigate();
    const { navigator } = useContext(NavigationContext);
    const outletContext = useOutletContext();
    const location = useLocation();

    useEffect(() => {
      console.log('coming in the withrouter');
      const { pathname } = location;
      const pageName = getPageViewName(pathname);
      if (pageName) {
        amplitudeLogEvent(`Page View: ${pageName}`);
      }
    }, [location])

    return (
      <Component
        {...props}
        {...outletContext}
        params={params}
        navigate={navigate}
        navigator={navigator}
        location={location}
      />
    );
  }

  const name = Component.displayName || Component.name;
  render.displayName = `withRouter(${name})`;

  return render;
}
