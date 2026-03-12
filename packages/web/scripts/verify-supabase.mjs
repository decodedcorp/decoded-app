/**
 * Supabase 연결 확인 스크립트
 * 실행: cd packages/web && node scripts/verify-supabase.mjs
 *
 * .env.local이 packages/web/ 또는 프로젝트 루트에 있어야 함.
 * dotenv 미설치 시: npx dotenv -e .env.local -- node scripts/verify-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local 로드 (간단한 파서)
function loadEnv() {
  const paths = [
    resolve(__dirname, "../.env.local"),
    resolve(__dirname, "../../../.env.local"),
    resolve(__dirname, "../../../.env"),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      for (const line of content.split("\n")) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
          const key = m[1].trim();
          const val = m[2].trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) process.env[key] = val;
        }
      }
      console.log("Loaded env from:", p);
      break;
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("\n=== Supabase 연결 확인 ===\n");

// 1. env 변수 확인
console.log("1. 환경 변수:");
console.log("   NEXT_PUBLIC_SUPABASE_URL:", url ? `${url.slice(0, 40)}...` : "(없음)");
console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", anonKey ? `${anonKey.slice(0, 20)}...` : "(없음)");
console.log("   SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "설정됨" : "(없음)");

if (!url || !anonKey) {
  console.error("\n오류: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 필요");
  process.exit(1);
}

// 2. 연결 테스트
const client = createClient(url, anonKey);
const adminClient = serviceKey ? createClient(url, serviceKey) : null;

async function run() {
  try {
    // anon key로 users 테이블 조회 (RLS 적용)
    console.log("\n2. Anon key로 users 테이블 조회 (RLS 적용):");
    const { data: anonData, error: anonError } = await client
      .from("users")
      .select("id, email, username, is_admin")
      .eq("id", "7238d904-40b4-407f-a0ab-a9662722494d")
      .maybeSingle();

    if (anonError) {
      console.log("   오류:", anonError.message);
    } else if (anonData) {
      console.log("   성공:", JSON.stringify(anonData, null, 2));
    } else {
      console.log("   결과: (행 없음)");
    }

    // service role 있으면 동일 쿼리 (RLS 우회)
    if (adminClient) {
      console.log("\n3. Service role로 users 테이블 조회 (RLS 우회):");
      const { data: adminData, error: adminError } = await adminClient
        .from("users")
        .select("id, email, username, is_admin")
        .eq("id", "7238d904-40b4-407f-a0ab-a9662722494d")
        .maybeSingle();

      if (adminError) {
        console.log("   오류:", adminError.message);
      } else if (adminData) {
        console.log("   성공:", JSON.stringify(adminData, null, 2));
      } else {
        console.log("   결과: (행 없음)");
      }
    }

    // 4. 테이블 존재 여부 (간단한 count)
    console.log("\n4. users 테이블 행 수:");
    const { count, error: countError } = await (adminClient || client)
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.log("   오류:", countError.message);
    } else {
      console.log("   총", count, "행");
    }

    console.log("\n=== 완료 ===\n");
  } catch (e) {
    console.error("오류:", e.message);
    process.exit(1);
  }
}

run();
