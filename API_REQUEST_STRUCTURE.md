# API Request Structure

Updated API service to match your backend specifications exactly.

## Wallet Endpoints

### Create Wallet
**Endpoint:** `POST /wallet/create`
**Request Body:**
```json
{
  "password": "string",
  "userId": "string"
}
```

### Verify and Activate Wallet
**Endpoint:** `POST /wallet/verify-activate`
**Request Body:**
```json
{
  "userId": "string",
  "mnemonic": "string",
  "password": "string"
}
```

### Get Balance
**Endpoint:** `GET /wallet/{userId}/balance`
**Request Params:** `userId` in URL path

### Transfer Tokens
**Endpoint:** `POST /wallet/{userId}/transfer`
**Request Body:**
```json
{
  "recipient": "string",
  "amount": number,
  "password": "string"
}
```

### Get Wallet
**Endpoint:** `POST /wallet/{userId}`
**Request Body:**
```json
{
  "password": "string"
}
```

### Get Wallet Status
**Endpoint:** `GET /wallet/{userId}/status`
**Request Params:** `userId` in URL path

## Will Endpoints

### Create Will
**Endpoint:** `POST /will/create`
**Request Body:**
```json
{
  "userId": "string",
  "password": "string",
  "heirs": ["string"],
  "shares": [number]
}
```

### Update Activity
**Endpoint:** `POST /will/update-activity/{willIndex}`
**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

### Execute Will
**Endpoint:** `POST /will/execute/{willIndex}/{ownerAddress}`
**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

### Execute Will Automatically
**Endpoint:** `POST /will/execute-automatically/{ownerAddress}/{willIndex}`
**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

### Check Will Ready for Execution
**Endpoint:** `GET /will/check-ready/{ownerAddress}/{willIndex}`
**Request Params:** `ownerAddress` and `willIndex` in URL path

### Revoke Will
**Endpoint:** `POST /will/revoke/{willIndex}`
**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

### Get All Wills
**Endpoint:** `GET /will/all/{ownerAddress}`
**Request Params:** `ownerAddress` in URL path

## Usage Examples

### Frontend Hook Usage

```typescript
import { useApi } from '@/hooks/use-api'

function MyComponent() {
  const { 
    createWallet, 
    transferTokens, 
    createWill, 
    updateActivity,
    executeWill,
    revokeWill 
  } = useApi()

  // Create wallet
  const handleCreateWallet = async () => {
    await createWallet({
      password: 'userPassword',
      userId: 'user123'
    })
  }

  // Transfer tokens
  const handleTransfer = async () => {
    await transferTokens({
      userId: 'user123',
      recipient: '0x123...',
      amount: 100,
      password: 'userPassword'
    })
  }

  // Create will
  const handleCreateWill = async () => {
    await createWill({
      userId: 'user123',
      password: 'userPassword',
      heirs: ['0x123...', '0x456...'],
      shares: [50, 50]
    })
  }

  // Update activity
  const handleUpdateActivity = async () => {
    await updateActivity(1, 'user123', 'userPassword')
  }

  // Execute will
  const handleExecuteWill = async () => {
    await executeWill(1, '0x123...', 'user123', 'userPassword')
  }

  // Revoke will
  const handleRevokeWill = async () => {
    await revokeWill(1, 'user123', 'userPassword')
  }
}
```

## Configuration

The API service automatically switches between mock and real backend based on environment variables:

```env
# Use real backend
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=https://ajogun-willon-sui-backend.onrender.com

# Use mock data for testing
NEXT_PUBLIC_USE_MOCK_API=true
```

All request bodies now match your backend specifications exactly!