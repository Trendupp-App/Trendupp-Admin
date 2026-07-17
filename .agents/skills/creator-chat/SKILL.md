---
name: admin-chat-integration
description: Context, specifications, and message flows for implementing the admin Chat feature.
---

# Admin-Mediated Dispute Chat System Lifecycle

This document defines the end-to-end lifecycle and testing guide for the Admin-Mediated Dispute Chat System. It provides technical specs for both the frontend and backend implementations.

---

## Step 1: Client Authentication & GetStream Connection

Before any chat or dispute actions can occur, every participant (admin, Brand, Admin) must authenticate with both the NestJS server and the GetStream server.

### 1. Login to NestJS Server

admins, Brands, and Admins log in normally to retrieve their standard JWT token.

### 2. Fetch Stream User Token

- **Endpoint:** `GET /api/v1/disputes/stream-token`
- **Headers:** `Authorization: Bearer <JWT_USER_TOKEN>`
- **Response Example:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "apiKey": "stream_app_api_key"
  }
  ```

### 3. Connect to GetStream

- The frontend uses this `token` and `apiKey` to initialize the Stream Chat client-side SDK:
  ```javascript
  client.connectUser({ id: userId, name: userName }, token);
  ```
- _Note: If a user attempts to search for channels at this point, they will see nothing because no channel has been created yet._

---

## Step 2: Dispute is Raised (Brand or admin)

Either party can escalate a campaign to a dispute when a conflict arises.

- **Endpoint:** `POST /api/v1/disputes`
- **Headers:** `Authorization: Bearer <JWT_USER_TOKEN>`

### Payload (When admin escalates)

```json
{
  "campaignId": "3a7b68fc-9b2c-47ea-bc91-2bbdd670a256",
  "reason": "The brand is refusing to approve my submitted content draft."
}
```

### Payload (When Brand escalates)

Brands must specify which admin they are disputing if there are multiple participants on the campaign:

```json
{
  "campaignId": "3a7b68fc-9b2c-47ea-bc91-2bbdd670a256",
  "adminId": "4c1eef8a-95db-4f31-ad90-df6e7d96dcd5",
  "reason": "The admin submitted blank draft URLs and is unresponsive."
}
```

### Expected Result

- Returns the created dispute record with status set to `raised`.
- **Crucial Behavior:** No Stream channel is created yet. Brand and admin still cannot message each other.

---

## Step 3: Admin Activates the Dispute Chat (Admin Only)

1. The Admin selects a raised dispute from the back-office queue.
2. The Admin client hits the `disputes/stream-token` endpoint to retrieve the Stream API key and prepare the Stream client.
3. The Admin reviews the dispute details and opens the channel to mediate.

- **Endpoint:** `POST /api/v1/disputes/:id/activate` _(Where `:id` is the Dispute UUID)_
- **Headers:** `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Payload:**
  The Admin can optionally invite a Finance Admin to participate in the conversation:
  ```json
  {
    "financeAdminId": "9b1deb4d-3b7d-4ac5-9f12-0056bc2bdf55"
  }
  ```

### Expected Result

- The dispute status updates to `under_review`.
- The backend initializes the GetStream channel `dispute_{disputeId}` with the members: **admin, Brand, Activating Admin, and Finance Admin** (if passed).
- An automated system message is posted to the channel: _"Admin has opened this chat to resolve the dispute. Brand and admin can now discuss."_
- **Frontend Behavior:** The chat box becomes visible on both the admin's and the Brand's applications. They can now type and chat.

---

## Step 4: Dispute Resolution (Finance / Super Admin Only)

Once a decision is reached, the Finance Admin or Super Admin resolves the dispute and closes the conversation.

- **Endpoint:** `POST /api/v1/disputes/:id/resolve` _(Where `:id` is the Dispute UUID)_
- **Headers:** `Authorization: Bearer <JWT_FINANCE_ADMIN_TOKEN>`
- **Payload:**
  ```json
  {
    "action": "release_to_admin", // Options: "release_to_admin" | "refund_to_brand" | "split"
    "notes": "Escrow resolved. Escrowed payment is released to the admin.",
    "splitadminAmount": 0 // Only required if action is "split"
  }
  ```

### Expected Result

- The dispute status updates to `resolved`.
- The backend calls the GetStream API to **freeze** the channel.
- **Frontend Behavior:** The chat box inputs are disabled for both the Brand and the admin. They can scroll and read historic messages, but the interface is read-only.

---

## Step 5: GetStream User Registration Architecture & UI Load Flow

To prevent GetStream channel creation failures (which occur if participants are not yet registered/saved in Stream when an admin attempts to activate a dispute), the backend and frontend implement a combined "Double Safety" user registration strategy.

### GetStream User Upsert Strategy

1. **GET `/disputes/stream-token`:**
   - When any user fetches their Stream token, the backend calls `upsertUser({ id, name, email })` to register their full profile (name, email) in GetStream before returning the token.
2. **POST `/disputes/:id/activate`:**
   - When the admin activates the dispute, the backend calls `upsertUsers([creatorId, brandId, adminId])` using minimal `{ id }` objects.
   - This ensures that GetStream channel creation never fails, even if some of the participants have not requested a token yet.

### Admin Client UI Dispute Load Flow

- In the dispute Back-Office view, the `admin-disp-id` input field must **NOT** be readonly.
- An interactive **"Load"** button must be added next to the `admin-disp-id` input on the client to allow admins to validate and fetch dispute details by ID before activation.
