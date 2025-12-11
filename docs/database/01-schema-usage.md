# Database Schema Usage Guide

> **Last updated:** 2025-12-11
> **Source of truth:** `db MCP` snapshot + `Supabase` migrations

## 0. Scope & Purpose

> **Note:** This document summarizes the **domain-level usage** of `image`, `item`, `post`. It is not an exhaustive list of every column but focuses on fields critical to the pipeline and frontend.

This document outlines the **current usage patterns** for the `image`, `item`, and `post` tables.
It focuses on:

- Which pipelines populate the data
- How the frontend/backend consumes it
- The semantic meaning of `enum` and `jsonb` fields

Use this guide to understand the domain logic behind the schema, rather than just a list of columns.

---

## 1. Table: `image`

Primary table for storing uploaded fashion images and their processing status.

### 1.1 Key Columns & Enums

- **`id`**: `uuid` (PK)
- **`status`**: `enum image_status`
  - `pending`: Initial state after upload.
  - `extracted`: Items have been successfully detected and extracted.
  - `skipped`: Image was processed but no items were found or it was invalid.
  - `extracted_metadata`: **(New)** Metadata (tags, colors, etc.) has been extracted, but item detection might still be pending or separate.
- **`with_items`**: `boolean` - Flag indicating if items have been associated with this image.
- **`image_url`**: `text` - Public URL of the uploaded image.

### 1.2 Usage Flow

1.  **Upload**: User uploads an image -> `pending` record created.
2.  **AI Pipeline**:
    - Analyzes image.
    - Updates status to `extracted_metadata` or `extracted`.
    - Populates `item` table if items are found.
    - Sets `with_items = true`.
3.  **Frontend**:
    - `useLatestImages` fetches images ordered by `created_at`.
    - Displays status badges based on the enum.

### 1.3 Example Query (Supabase Client)

```typescript
// lib/supabase/queries/images.ts

// Fetch latest images that have items or are processed
const { data, error } = await supabase
  .from("image")
  .select("*, item(*)") // Join with items
  .not("image_url", "is", null)
  .order("created_at", { ascending: false })
  .limit(20);
```

---

## 2. Table: `item`

Stores individual fashion items detected within an `image`.

### 2.1 Key Columns

- **`image_id`**: `uuid` (FK -> `image.id`)
- **`product_name`** / **`brand`**: `text` - Basic metadata.
- **`sam_prompt`**: `text` - The prompt used for the Segment Anything Model (SAM) to localize this item.
- **`bboxes`**: `jsonb` - Array of bounding boxes for the detected item.
  - Structure: `Array<{ x: number, y: number, w: number, h: number }>` (Normalized 0-1 coordinates)
- **`scores`**: `jsonb` - Confidence scores for the detection/segmentation.
- **`ambiguity`**: `boolean` - `true` if the AI was uncertain about the detection.
- **`cropped_image_path`**: `text` - Path to the cropped version of this specific item.
- **`status`**: `text` (default: `'active'`) - Status of the item (e.g., could be used for moderation).

### 2.2 TypeScript Type Definition (App-Level)

Since `jsonb` fields often result in `any` or `Json` types, we define specific interfaces for usage:

```typescript
export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ItemWithParsedData = Database["public"]["Tables"]["item"]["Row"] & {
  bboxes: BBox[] | null;
  scores: number[] | null;
};
```

### 2.3 Example Query

```typescript
// lib/supabase/queries/items.ts

const { data } = await supabase
  .from("item")
  .select("*")
  .eq("image_id", imageId)
  .order("created_at", { ascending: true });
```

---

## 3. Table: `post`

Represents social posts that may feature multiple items.

### 3.1 Key Columns

- **`item_ids`**: `jsonb`
  - Stores references to `item` records displayed in this post.
  - Structure: `number[]` (Array of `item.id`s) or `string[]` depending on ID type.
  - _Note: Check if `item.id` is `bigint` or `uuid`. Current schema uses `bigint` for item keys._

### 3.2 Usage

- Used to render "Shop the look" style posts where one post highlights multiple detected items.

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    image ||--o{ item : "contains detected"
    image ||--o{ post_image : "linked in"
    post ||--o{ post_image : "features"
    post |o--o{ item : "highlights (via item_ids)"

    image {
        uuid id PK
        enum status
        string image_url
    }

    item {
        bigint id PK
        uuid image_id FK
        jsonb bboxes
        string sam_prompt
    }

    post {
        uuid id PK
        jsonb item_ids
    }
```

---

## 5. Using `db MCP` for Verification

When in doubt about the current schema state, use the MCP tool to check the live database definition.

**Instructions:**

1.  Ask Cursor Agent: "List tables image, item, post using db mcp"
    - Tool: `mcp_supabase-decoded-ai_list_tables`
2.  Review the output for:
    - New columns
    - Changed enum values
    - Foreign key constraints

> **Rule:** When updating this document, always verify against a fresh MCP snapshot.

---

## Changelog

- **2025-12-11**: Initial version (Snapshot based on `db MCP` for `image`, `item`, `post`).
