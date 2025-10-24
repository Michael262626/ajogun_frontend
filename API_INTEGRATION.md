# API Integration Guide

## Backend Integration

Your frontend is now connected to the backend at: `https://ajogun-willon-sui-backend.onrender.com`

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# API Configuration
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://ajogun-willon-sui-backend.onrender.com

# Debug flags (optional)
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_DEBUG_WALLET=true
```

### Switching Between Mock and Real API

- **Production**: Set `NEXT_PUBLIC_USE_MOCK_API=false` (uses real backend)
- **Development/Testing**: Set `NEXT_PUBLIC_USE_MOCK_API=true` (uses mock data)

## Available Endpoints

### Wallet Endpoints
- `POST /wallet/create` - Create new wallet
- `GET /wallet/:userId` - Get wallet info
- `GET /wallet/:userId/balance` - Get wallet balance
- `POST /wallet/:userId/transfer` - Transfer tokens
- `POST /wallet/verify-activate` - Verify and activate wallet
- `POST /wallet/activate-alternative` - Alternative activation
- `POST /wallet/import` - Import existing wallet
- `GET /wallet/:userId/status` - Get wallet status

### Will Endpoints
- `POST /will/create` - Create new will
- `POST /will/update-activity/:willIndex` - Update activity
- `POST /will/initiate/:willIndex/:ownerAddress` - Initiate execution
- `POST /will/execute/:willIndex/:ownerAddress` - Execute will
- `POST /will/execute-automatically/:ownerAddress/:willIndex` - Auto execute
- `POST /will/revoke/:willIndex` - Revoke will
- `GET /will/check-ready/:ownerAddress/:willIndex` - Check if ready
- `GET /will/monitored-wills` - Get monitored wills
- `GET /will/all/:ownerAddress` - Get all wills for owner

## Usage in Components

```typescript
import { useApi } from '@/hooks/use-api'

function MyComponent() {
  const { 
    createWallet, 
    createWill, 
    fetchWills, 
    transferTokens,
    createWalletState,
    createWillState 
  } = useApi()

  // Create wallet
  const handleCreateWallet = async () => {
    const result = await createWallet({
      userId: 'user123',
      password: 'password'
    })
  }

  // Create will
  const handleCreateWill = async () => {
    const result = await createWill({
      userId: 'user123',
      password: 'password',
      heirs: ['0x123...', '0x456...'],
      shares: [50, 50],
      amount: '1000'
    })
  }

  return (
    <div>
      {createWalletState.loading && <p>Creating wallet...</p>}
      {createWillState.loading && <p>Creating will...</p>}
    </div>
  )
}
```

## Error Handling

The API service includes automatic error handling with:
- Loading states
- Error messages
- Success notifications
- Retry logic (configurable)

## Testing

1. **Mock Mode**: Set `NEXT_PUBLIC_USE_MOCK_API=true` for testing without backend
2. **Real API Mode**: Set `NEXT_PUBLIC_USE_MOCK_API=false` for production

## Debugging

Enable debug logs with:
```env
NEXT_PUBLIC_DEBUG_API=true
NEXT_PUBLIC_DEBUG_WALLET=true
```

This will log API requests, responses, and wallet operations to the console.