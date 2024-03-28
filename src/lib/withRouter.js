import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, useLocation, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { getPageViewName } from 'lib/amplitudeEvents'

export function withRouter(Component) {
  function render(props) {
    const params = useParams();
    const navigate = useNavigate();
    const { navigator } = useContext(NavigationContext);
    const outletContext = useOutletContext();
    const location = useLocation();

    useEffect(() => {
      const { pathname } = location;
      const dashboardPage = pathname.split('/')[3][0].toUpperCase() + pathname.split('/')[3].slice(1);
      const subPage = pathname.split('/')[4] ? pathname.split('/')[4][0].toUpperCase() + pathname.split('/')[4].slice(1) : '';
      const pageName = getPageViewName(dashboardPage, subPage);
      // eslint-disable-next-line no-undef
      amplitude.track(`Page View: ${pageName}`);
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
