# Login-Gated Webchat Loading

## Overview
Botpress webchat scripts load only after user authentication, preventing unauthorized access.

## Implementation

### Load scripts after login:
```typescript
useEffect(() => {
  if (!isLoggedIn) return;

  const script1 = document.createElement('script');
  script1.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js';
  document.body.appendChild(script1);

  const script2 = document.createElement('script');
  script2.src = 'https://files.bpcontent.cloud/2026/01/07/15/20260107150430-TIG10B51.js';
  script2.defer = true;
  document.body.appendChild(script2);

  const interval = setInterval(() => {
    if (window.botpress) {
      window.botpress.on('webchat:initialized', () => {
        setWebchatReady(true);
      });
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
}, [isLoggedIn]);
```

### Update user credentials when ready:
```typescript
useEffect(() => {
  if (!webchatReady || !isLoggedIn) return;

  window.botpress.updateUser({
    data: { username, password }
  });
}, [webchatReady, isLoggedIn, username, password]);
```

## Flow
1. User logs in → `isLoggedIn` becomes `true`
2. Scripts inject into DOM
3. Webchat initializes → `webchatReady` becomes `true`
4. User credentials sent via `updateUser()`

## Files Modified
- `app/layout.tsx` - Removed static script tags
- `app/page.tsx` - Added dynamic script loading logic
