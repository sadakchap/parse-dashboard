const BLOCKED_NAVIGATION_ERROR_MESSAGE = 'Router navigation was blocked';

let routingBlock = null;

const blockedNavigationErrorHandler = (evt) => {
  if (evt.error.message === BLOCKED_NAVIGATION_ERROR_MESSAGE) {
    // prevent red message in console
    evt.preventDefault();
    // stop bubbling
    evt.stopPropagation();
    // mark cancelled
    return true;
  } else {
    // TODO: should we re-throw here?

    // mark as not cancelled
    return false;
  }
};

// handles browser back/forward controls
const popstateHandler = (evt) => {
  if (routingBlock) {
    // revert the blocked url. this "breaks" browser back/forward buttons since we are pushing to
    // the top of the history stack, so when unblocked, those buttons won't navigate relative to the
    // blocked href position in the history stack, but relative to the top of the stack (hence
    // probably no forward). If there was way to know whether this popstate was caused by forward or
    // back buttons we could use history.go(-1) or history.go(1) - in that case back/forward buttons
    // would work as expected upon block release, however we don't have such info here
    window.history.pushState({}, '', routingBlock.href);
  }
};

const beforeUnloadHandler = (evt) => {
  if (routingBlock) {
    evt.preventDefault();
    return (evt.returnValue = routingBlock.prompt);
  }
};

function cleanup() {
  routingBlock = null;
  window.removeEventListener('error', blockedNavigationErrorHandler, true);
  window.removeEventListener('popstate', popstateHandler, true);
  window.removeEventListener('beforeunload', beforeUnloadHandler, true);
}

export function blockRouting(prompt) {
  routingBlock = {
    prompt: prompt ?? 'Are you sure you want to navigate away?',
    href: window.location.href,
  };

  window.addEventListener('error', blockedNavigationErrorHandler, true);
  window.addEventListener('popstate', popstateHandler, true);
  window.addEventListener('beforeunload', beforeUnloadHandler, true);

  return cleanup;
}

// when nothing is blocked passes through all history fields, throws when blocked
const historyProxy = new Proxy(window.history, {
  get(target, prop, receiver) {
    if (routingBlock) {
      const confirmed = window.confirm(routingBlock.prompt);
      if (confirmed) {
        // release the block and let the navigation happen
        cleanup();
      } else {
        // block react-router navigation by throwing an error here
        throw new Error('Router navigation was blocked');
      }
    }
    const value = target[prop];

    if (value instanceof Function) {
      return function (...args) {
        return value.apply(this === receiver ? target : this, args);
      };
    }

    return value;
  },
});

// pass-through proxy of window object with special handling of "history" field which is used by
// react-router
const windowProxy = new Proxy(window, {
  get(target, prop, receiver) {
    if (prop === 'history') {
      return historyProxy;
    }

    const value = target[prop];

    if (value instanceof Function) {
      return function (...args) {
        return value.apply(this === receiver ? target : this, args);
      };
    }

    return value;
  },
});

export default windowProxy;
